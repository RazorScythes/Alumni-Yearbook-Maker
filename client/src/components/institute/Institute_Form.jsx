import React, { useState, useEffect } from 'react'
import { Button, Container, Modal, Row, Col, Form, ListGroup, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { uploadInstitute, editInstitute } from '../../actions/institute';

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";

import TooltipHelper from '../TooltipHelper'

const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
})

const Institute_Form = ({setModal, edit}) => {
    const dispatch = useDispatch()

    const institute = useSelector((state) => state.institute)

    const [spinner, setSpinner] = useState(false)
    const [submission, setSubmission] = useState(false)
    const [show, setShow] = useState(true);
    const [program, setProgram] = useState(edit ? edit.program : [])
    console.log(edit)
    const [form, setForm] = useState({
        priority_value: edit ? edit.priority_value : 1,
        logo: '',
        background: '',
        overwrite: edit ? edit.overwrite : false,
        institute: edit ? edit.institute : '',
        institute_acronym: edit ? edit.institute_acronym : '',
        program: '',
    })

    const [field, setField] = useState({
        program: '',
        program_acronym: ''
    })

    const [require, setRequire] = useState({
        institute: false,
        institute_acronym: false,
        program: false,
        program_acronym: false
    })

    const [logo, setLogo] = useState({
        required: '',
        b64_image: '',
    })

    const [background, setBackground] = useState('')



    useEffect(() => {
        if(submission) 
            if(!edit) dispatch(uploadInstitute(form))
            else dispatch(editInstitute(form))
    }, [submission, dispatch])

    useEffect(() => {
        if(institute.message){
            setShow(false)
            setModal({modal: false, edit: null})
        }
    }, [institute.message, institute])

    const base64Image = (file, type) => {
        if(!file) {
            if(type === "logo") setLogo({...logo, required: true, b64_image: ''})
          return;
        }

        if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            return;
        }

        fileToDataUri(file)
          .then(dataUri => {
            if(type === "logo") setLogo({...logo, required: false, b64_image: dataUri})
            else setBackground(dataUri)
          })
    }

    const addProgram = () => {
        if(!field.program && !field.program_acronym) setRequire({...require, program: true, program_acronym: true})
        else if(!field.program) setRequire({...require, program: true})
        else if(!field.program_acronym) setRequire({...require, program_acronym: true})
        else {
            let newProgram = `${field.program} - ${field.program_acronym.toUpperCase()}`
            let duplicate = false

            program.forEach(item => { if(newProgram === item) duplicate = true })

            if(duplicate) {
                setField({...field, program: '', program_acronym: ''})
                return
            }

            setRequire({...require, program: false, program_acronym: false})
            
            setProgram(program.concat(newProgram))

            setField({...field, program: '', program_acronym: ''})
        }
    }

    const deleteProgram = (e) => {
        var arr = program
        arr.splice(e.currentTarget.id, 1)
        setProgram([...arr])
    }

    const program_list = program.map((item, index) => {
        return (
            <ListGroup.Item key={index} as="li">{item}<Button id={index} onClick={deleteProgram} style={{float: "right", width:30, height: 30, fontSize: 5, padding:0, veticalAlign:"center"}} variant="danger"><Tooltip title={"Remove"}><DeleteIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}</ListGroup.Item>
        )
    })

    const handleSubmit = () => {
        if(!logo.b64_image) setLogo({...logo, required: true})
        else setLogo({...logo, required: false})

        if(!form.institute && !form.institute_acronym) setRequire({...require, institute: true, institute_acronym: true})
        else if(!form.institute) setRequire({...require, institute: true})
        else if(!form.institute_acronym) setRequire({...require, institute_acronym: true})
        else {
            setRequire({...require, institute: false, institute_acronym: false})
            if(!logo.b64_image) return

            setForm({
                ...form,
                logo: logo.b64_image,
                priority_value: form.priority_value ? form.priority_value : 1,
                background: background,
                overwrite: form.overwrite ? form.overwrite : false,
                program: program,
            })
            
            setSubmission(true)
            setSpinner(true)
        }
    }

    const handleEdit = () => {
        setForm({
            ...form,
            id: edit ? edit._id : '',
            institute: form.institute ? form.institute : edit.institute,
            institute_acronym: form.institute_acronym ? form.institute_acronym : edit.institute_acronym,
            logo: logo.b64_image,
            background: background,
            overwrite: form.overwrite ? form.overwrite : false,
            priority_value: form.priority_value ? form.priority_value : 1,
            program: program,
        })
        setSubmission(true)
        setSpinner(true)
    }

    return (
        <>
        <Modal
            size="lg"
            show={show}
            onHide={() => {
                    setShow(false)
                    setModal({modal: false, edit: null})
                }
            }
            aria-labelledby="example-modal-sizes-title-lg"
            backdrop="static"
        >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
                {edit ? 'Edit Institute' : 'New Institute'}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <div>
                                <Form.Label style={{color: "#000"}}>Priority Value</Form.Label>
                                <TooltipHelper
                                    text={"Indicator of who will popup first. The higher the value it is more likely shows up first."}                                
                                />
                            </div>
                            <Form.Control  value={form.priority_value} onChange={(e) => setForm({...form, priority_value: e.target.value})} style={{width:70}} type="number" min="1"/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="formFileSm" className="mb-3" style={{marginTop:7}}>
                            <Form.Label>Institute Logo (transparent)</Form.Label>
                            <Form.Control accept="image/*" type="file" size="sm" onChange={(event) => base64Image(event.target.files[0] || null, 'logo')}/>
                            { logo.required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formFileSm" className="mb-3">
                            <Form.Label>Background Template (Optional)</Form.Label>
                            <TooltipHelper
                                    text={"Change the background of the institute design on yearbook file. If file empty, it will automatically be set as batch year template"}                                
                                />
                            <Form.Control accept="image/*" type="file" size="sm" onChange={(event) => base64Image(event.target.files[0] || null)}/>
                            {
                                edit ? 
                                    edit.background &&
                                    <Form.Group className="mt-1" controlId="formBasicCheckbox">
                                        <Form.Check checked={form.overwrite} onClick={(e) => setForm({...form, overwrite: e.target.checked})} type="checkbox" label="Overwrite yearbook background" />
                                    </Form.Group>
                                : null
                            }
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Label>Institute Name</Form.Label>
                        <Form.Control value={form.institute} onChange={(e) => {form.institute.length > 0 ? setRequire({...require, institute: false}) : setRequire({...require, institute: true}); setForm({...form, institute: e.target.value})}} size="sm" type="text" placeholder="" />
                        { require.institute ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                    </Col>

                    <Col>
                        <Form.Label>Institute Acronym</Form.Label>
                        <Form.Control value={form.institute_acronym} onChange={(e) => {form.institute_acronym.length > 0 ? setRequire({...require, institute_acronym: false}) : setRequire({...require, institute_acronym: true}); setForm({...form, institute_acronym: e.target.value.toUpperCase()})}} size="sm" type="text" placeholder="" />
                        { require.institute_acronym ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs={6}>
                        <Form.Label>Program (Full)</Form.Label>
                        <Form.Control value={field.program} onChange={(e) => {field.program.length > 0 && setRequire({...require, program: false}); setField({...field, program: e.target.value})}} size="sm" type="text" placeholder="" />
                        { require.program ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                    </Col>

                    <Col xs={3}>
                        <Form.Label>Acronym</Form.Label>
                        <Form.Control value={field.program_acronym} onChange={(e) => {field.program_acronym.length > 0 && setRequire({...require, program_acronym: false}); setField({...field, program_acronym: e.target.value.toUpperCase()})}} size="sm" type="text" placeholder="" />
                        { require.program_acronym ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                    </Col>

                    <Col xs={2}>
                        <Button  onClick={addProgram} style={{padding: 0, width: 30, height: 30, marginTop: 30, veticalAlign:"center"}} variant="primary"><Tooltip title={"Add Program"}><AddIcon/></Tooltip></Button>
                    </Col>
                </Row>
                <Row>
                    <Container style={{margin: "10px 0"}}>
                        {
                            program.length > 0 ?
                                <Col style={{border: "1px solid gray"}}>
                                    <ListGroup as="ol" numbered={true}>
                                        {program_list}
                                    </ListGroup>            
                                </Col>
                            : null
                        }
                    </Container>
                </Row>
                {
                    edit ? 
                    <>
                        <Button onClick={handleEdit} variant="primary" style={{float: "right"}}>Save Changes</Button>
                        {spinner ? <Spinner style={{float: "right", marginRight:5}} animation="border" variant="primary" /> : null}
                    </>
                    :
                    <>
                        <Button onClick={handleSubmit} variant="primary" style={{float: "right"}}>Create</Button>
                        {spinner ? <Spinner style={{float: "right", marginRight:5}} animation="border" variant="primary" /> : null}
                    </>
                }
            </Modal.Body>
        </Modal>
        </>
    );
}

export default Institute_Form
