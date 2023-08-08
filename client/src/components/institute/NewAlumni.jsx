import React, { useEffect, useState } from 'react'
import { checkStudentExists, uploadAlumni } from '../../actions/institute';
import { Button, Container, Row, Col, FloatingLabel, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import ProfileGrid from '../grid-image/ProfileGrid';
const NewAlumni = props => {
    const dispatch = useDispatch()
    const inst = useSelector((state) => state.institute)

    const validate = useSelector((state) => state.institute.validate_student)

    const [require, setRequire] = useState(0)
    const [contactRequire, setContactRequire] = useState(0)
    const [studentNumber, setStudentNumber] = useState('')
    const [invalidNumber, setInvalidNumber] = useState(0)
    const [invalidMain, setInvalidMain] = useState(0)
    const [submited, setSubmited] = useState(0)

    const [mainImage, setMainImage] = useState([{
        src: '',
        thumbnail: '',
        thumbnailWidth: 180,
        thumbnailHeight: 220,
    }])
    const [subImage, setSubImage] = useState([{
        src: '',
        thumbnail: '',
        thumbnailWidth: 240,
        thumbnailHeight: 150,
    },{
        src: '',
        thumbnail: '',
        thumbnailWidth: 240,
        thumbnailHeight: 150,
    },{
        src: '',
        thumbnail: '',
        thumbnailWidth: 240,
        thumbnailHeight: 150,
    }])

    const [image, setImage] = useState([])

    const [dropfile, setDropfile] = useState({
        main: [],
        subs: []
    })

    useEffect(() => {
        if(inst.message){
            setSubmited(0)
            props.setNewAlumni(0)
        }
    }, [inst.message, inst])

    const {getRootProps, getInputProps, fileRejections, isDragActive} = useDropzone({
        accept: "image/*",
        multiple: true,
        maxFiles: 3,
        onDrop: (acceptedFiles) => {    
            if (acceptedFiles.length > 0) {
                setDropfile({...dropfile, subs: acceptedFiles})
                Promise.all(acceptedFiles.map(file => {
                    return (new Promise((resolve,reject) => {
                        const reader = new FileReader();
                        reader.addEventListener('load', (ev) => {
                            resolve(ev.target.result);
                        });
                        reader.addEventListener('error', reject);
                        reader.readAsDataURL(file);
                    }));
                }))
                .then(images => {
                        let extraImage = []
                        images.map((item) => {
                            extraImage.push({
                                src: item,
                                thumbnail: item,
                                thumbnailWidth: 240,
                                thumbnailHeight: 150,
                                caption: item.name
                            })
                        })
                        setSubImage(extraImage)
                }, error => {        
                    console.error(error);
                });
            }
            setImage(   
                acceptedFiles.map((upFile) => Object.assign(upFile, {
                    preview: URL.createObjectURL(upFile),
                    filename: upFile.name,
                    filesize: upFile.size
                }))
            )
        }
    })

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const getMain = async (e) => {
        let convert
        if(e.target.files[0] && e.target.files[0]['type'].split('/')[0] === 'image'){
            convert = await toBase64(e.target.files[0])
            setMainImage([{
                src: convert,
                thumbnail: convert,
                thumbnailWidth: 180,
                thumbnailHeight: 220,
            }])
            setDropfile({...dropfile, main: e.target.files[0]})
            setInvalidMain(0)
        }
        else
            setInvalidMain(1)
    }

    const [form, setForm] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        quotes: '',
        address: '',
        email: '',
        contact: '',
    })

    const submit = async (e) => {
        e.preventDefault()
        // if(!form.first_name || !form.middle_name || !studentNumber)    
        if(!form.first_name || !form.last_name)    
            setRequire(1)
        else
            setRequire(0)
        
        if(form.contact)
            if((form.contact.length !== 10)){
                setContactRequire(1)
                return
            }
            else
                setContactRequire(0)

        // if(form.first_name && form.last_name && studentNumber && !invalidNumber && !validate && !invalidMain){
        if(form.first_name && form.last_name && !invalidNumber && !validate && !invalidMain){
            let formData = new FormData()

            if(dropfile.main)
                formData.append("main", dropfile.main)

            if(dropfile.subs.length > 0)
                dropfile.subs.map((file) => {
                    formData.append("subs", file)
                })
            Object.entries(form).map((keyName) => {
                formData.append(keyName[0], keyName[1])
            })
            formData.append("student_number", studentNumber ? studentNumber : '')
            formData.append("params", props.academic_year)
            formData.append("params", props.section)
            formData.append("params", props.institute)

            dispatch(uploadAlumni(formData))
        }
    }

    const validateStudent_Number = (e) => {
        // var regex = new RegExp(/^[0-9]{3,4}[-]{1}[0-9]{3,4}$/i);
        // if(regex.test(e.target.value))
        //     setInvalidNumber(0)
        // else
        //     setInvalidNumber(1)

        setInvalidNumber(0)
        setStudentNumber(e.target.value)
        dispatch(checkStudentExists({
            student_number: e.target.value
        }))
    }

    return (
        <div className="profileImageInput">
            <Button onClick={() => props.setNewAlumni(0)} variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}} /> Go Back</Button>
            <Container>
                <Form onSubmit={submit}>
                <Row>
                    { mainImage.length > 0 || subImage.length > 0 ? 
                        <Col> 
                            <div className="gridDisplay">
                                {
                                    mainImage.length > 0 &&
                                    <div className="profileGrid">
                                        <ProfileGrid
                                            rowHeight={364}
                                            image={mainImage && mainImage} 
                                        />
                                    </div>
                                }
                                {
                                    subImage.length > 0 &&
                                    <div className="profileGrid">
                                        <ProfileGrid
                                            rowHeight={180}
                                            image={subImage && subImage} 
                                        />
                                    </div>
                                }   
                            </div>
                        </Col>
                        : 
                        <Col style={{border:"1px solid gray"}}> 

                        </Col>
                    }
                    <Col>
                        <h5 style={{width:"350px"}}>New Student Information</h5>
                        <Form.Group as={Col} className="mb-3"controlId="formGridEmail" style={{width:"50%"}}>
                            <Form.Control type="text" placeholder="Student Number" onChange={validateStudent_Number}/>
                            {/* { require && !studentNumber ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } */}
                            { validate && <span style={{margin:"5px", color:"red", fontWeight:500}}>Already exists</span> }
                            { invalidNumber ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Invalid input</span> : null }
                        </Form.Group>
                        <Form.Group controlId="formFileSm" className="mb-3">
                        <Form.Label style={{fontWeight:600}}>Graduation Image</Form.Label>
                            <Form.Control type="file" accept="image/*" size="sm" onChange={getMain}/>
                            { invalidMain ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Invalid file type</span> : null }
                        </Form.Group>
                        <Form.Label style={{fontWeight:600}}>3 Extra Images (Optional)</Form.Label>
                        <div className="dragzoneProfile" {...getRootProps()}>
                            <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <div className="draglabel">
                                            <span><i className="bx bx-cloud-download"></i></span>
                                            <p>Drop the files here ...</p>
                                        </div> :
                                        <div className="draglabel">   
                                            <span><i className="bx bx-cloud-download"></i></span>
                                            <p>Drag 'n' drop image here, or click to select files</p>
                                        </div>

                                }
                        </div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" onChange={(e) => setForm({...form, first_name: e.target.value})}/>
                        { require && !form.first_name ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null }
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Middle Name</Form.Label>
                        <Form.Control type="text" placeholder="Middle Name"  onChange={(e) => setForm({...form, middle_name: e.target.value})}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name"  onChange={(e) => setForm({...form, last_name: e.target.value})}/>
                        { require && !form.last_name ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null }
                    </Form.Group>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel controlId="floatingTextarea" label="Quotes" className="mb-3">
                            <Form.Control as="textarea" maxLength={43} placeholder="Leave a comment here"  onChange={(e) => setForm({...form, quotes: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="floatingTextarea" label="Address" className="mb-3">
                            <Form.Control as="textarea" placeholder="Leave a comment here"  onChange={(e) => setForm({...form, address: e.target.value})}/>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Control type="email" placeholder="Email"  onChange={(e) => setForm({...form, email: e.target.value})}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Control type="number" onInput = {(e) =>{e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0,10)}} placeholder="09xxxxxxxxx" pattern="[0-9]{11}"  maxlength="11" onChange={(e) => setForm({...form, contact: e.target.value})}/>
                        { contactRequire  ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Invalid Format</span> : null }
                    </Form.Group>            
                </Row>
                <button className="btn btn-dark" type="submit" style={{float:"right", marginBottom:20}}>Register</button>    
                </Form> 
            </Container>
        </div>
    )
}

export default NewAlumni
