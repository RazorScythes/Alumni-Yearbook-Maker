import React, { useState, useCallback, useEffect } from 'react'
import { Row, Col, Button, FloatingLabel, Modal, FormSelect, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'
import Cropper from 'react-easy-crop'

import getCroppedImg from '../cropImage'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosition, addPosition, editPosition, deletePosition, uploadMessage, editMessage, getCommenceYear } from '../../actions/commence'
import { Link } from 'react-router-dom'

import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";

import { Formik, Form } from 'formik';
import { TextArea, NormalTextField } from '../batch-template/TextArea'
import * as Yup from 'yup';

import TooltipHelper from '../TooltipHelper'

const positions = [
  "College President",
  "Mayor", 
  "Vice President for Academic Affairs", 
  "Vice President for Administration",
  "Vice President for External Affairs",
  "Ched Regional", 
  "Dean", 
]

const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
})

const Forms = props => {
    const id = useSelector((state) => props.edit ? state.commence.message_list.find((p) => p._id === props.edit) : null)

    const commence = useSelector((state) => state.commence)
    const year_list = useSelector((state) => state.commence.academic_year)
    const position_list = useSelector((state) => state.commence.position_list)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCommenceYear())
        dispatch(fetchPosition())
    }, [dispatch])

    useEffect(() => {
      if(commence.message){
        props.setNew(false)
        props.setEdit("")
      }
    }, [commence.message, commence])

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [preventspam, setPreventSpam] = useState(false)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [show, setShow] = useState(false);

    const [preview, setPreview] = useState(false)
    const [previewShow, setPreviewShow] = useState(false)
    
    const [signaturePreview, setSignaturePreview] = useState(false)
    const [signaturePreviewShow, setSignaturePreviewShow] = useState(false)

    const [dataUri, setDataUri] = useState('')
    const [signatureUri, setSignatureUri] = useState('')

    const [require, setRequire] = useState(false)
    const [form, setForm] = useState({
        position: id ? id.position._id : '',
        quotes: id ? id.quotes : '',
        academic_year: id ? id.academic_year._id : ''
    })

    const [n_p_modal, setNPModal] = useState('')
    const [focus, setFocus] = useState(0)
    const [position, setPosition] = useState('')

    const [initialForm, setInitialForm] = useState({
        name: id ? id.name : '',
        position: id ? id.position.position : '',
        quotes: id ? id.quotes : '',
        content: id ? id.message : '',
        academic_year: id ? id.academic_year.academic_year : '',
        academic_year_id: id ? id.academic_year._id : ''
    })

    const [submited, setSubmited] = useState(false)

    const handleClose = () => setShow(false);

    const onChange = (file) => {
        if(!file) {
          setDataUri('');
          return;
        }
    
        fileToDataUri(file)
          .then(dataUri => {
            setDataUri(dataUri)
            setRequire(false)
            setShow(true)
          })
    }

    const onChangeSignature = (file) => {
        if(!file) {
          setSignatureUri('');
          return;
        }

        fileToDataUri(file)
          .then(dataUri => {
            setSignatureUri(dataUri)
            setSignaturePreview(true)  
          })
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
          setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
          if(preventspam) return
          
          try {
            setPreventSpam(true)
            const croppedImage = await getCroppedImg(
              dataUri,
              croppedAreaPixels,
            )

            setCroppedImage(croppedImage)
            setDataUri(croppedImage)
            setShow(false)
            setPreview(true)  
            setPreventSpam(false)
            setRequire(false)

          } catch (e) {
            console.error(e)
          }
        }, [croppedAreaPixels])

    const PreviewModal = () => {
          return(
              <Modal show={preview} onHide={setPreviewShow} animation={true}>
                <Modal.Header closeButton>
                  <Modal.Title>Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{height:450, margin:"auto"}}>
                    <img src={croppedImage} style={{maxHeight:400}}/>   
                </Modal.Body>
              </Modal>
          )
      }

    const SignaturePreviewModal = () => {
        return(
            <Modal show={signaturePreviewShow} onHide={setSignaturePreviewShow} animation={true}>
              <Modal.Header closeButton>
                <Modal.Title>Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{height:"auto",  margin:"auto"}}>
                  <img src={signatureUri} style={{maxHeight:400, width:"100%"}}/>   
              </Modal.Body>
            </Modal>
        )
    }

    const NewPositionModal = () => {
      const [show, setShow] = useState(true);

      const handleClose = () => {
        setShow(false);
        setNPModal('')
      }

      const [positionForm, setPositionForm] = useState({
          id: n_p_modal === 'edit' ? position_list[focus]._id : '',
          position: n_p_modal === 'edit' ? position_list[focus].position : '',
          priority_value: n_p_modal === 'edit' ? position_list[focus].priority_value : 1
      })
      const [required, setRequired] = useState(false)
      const [modalAlert, setModalAlert] = useState({
          message: '',
          variant: ''
      })

      const submit = () => {
        if(positionForm.position.length === 0){
          setRequired(true)
          return
        }
        else setRequired(false)

        if(n_p_modal === 'new') dispatch(addPosition(positionForm))
        else if(n_p_modal === 'edit') dispatch(editPosition(positionForm))

        setPositionForm({
          position: '',
          priority_value: 1
        })
      }

      const delete_position = () => {
        dispatch(deletePosition({id: position_list[focus]._id}))

        setPositionForm({
          position: '',
          priority_value: 1
        })
      }

      useEffect(() => {
          if(n_p_modal === 'delete' && commence.modal_message){
            setFocus(0)
            setPosition(position_list.length > 0 ? position_list[0].position : '')
            setShow(false);
            setNPModal('')
            commence.modal_message = ''
          }
          else if(commence.modal_message){
            setModalAlert({message: commence.modal_message, variant: commence.modal_variant})
            commence.modal_message = ''
            commence.modal_variant = ''
          }
      }, [commence.modal_message, commence])

      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{n_p_modal === 'new' ? "New Position" : n_p_modal === 'edit' ? "Edit Position" : "Confirm Deletion"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    
              {
                modalAlert.message ? 
                  <Alert variant={modalAlert.variant ? modalAlert.variant : "success"} style={{padding: 7}}>
                    {modalAlert.message}
                  </Alert>
                : null
              }
              
              {
                n_p_modal === 'new'|| n_p_modal === 'edit' ?
                  <Row>
                    <Col>
                        <FormGroup className="mb-3" controlId="exampleForm.ControlInput1">
                            <FormLabel style={{color: "#000"}} >Honor Title</FormLabel>
                            <FormControl onChange={(e) => {
                              setPositionForm({...positionForm, position: e.target.value})
                              e.target.value.length > 0 ? setRequired(false) : setRequired(true)
                            }} value={positionForm.position} type="text" placeholder="Enter Title" />
                            { required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                        </FormGroup>
                    </Col>
                    <Col xs={4}>
                        <FormGroup className="mb-3" controlId="exampleForm.ControlInput1">
                            <div>
                                <FormLabel style={{color: "#000"}}>Priority Value</FormLabel>
                                <TooltipHelper
                                    text={"Indicator of who will popup first. The higher the value it is more likely shows up first."}                                
                                />
                            </div>
                            <FormControl onChange={(e) => setPositionForm({...positionForm, priority_value: e.target.value})} value={positionForm.priority_value} style={{width:70}} type="number" min="1"/>
                        </FormGroup>
                    </Col>
                  </Row>
                : <Row>
                    <p>Deleting Position <span style={{color: "red", fontWeight:500}}>{position_list[focus] ? position_list[focus].position : ''}</span></p>
                    <p>Are you sure you want to delete this?</p>
                    <p style={{color: "red", fontWeight:500}}>
                        it will also remove all the related data attatch to this position (All Academic Year Related)
                    </p>
                  </Row>
              }

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              {
                n_p_modal === 'delete' ?
                  <Button variant="danger" onClick={delete_position}>
                    Delete
                  </Button>
                  :
                  <Button variant="success" onClick={submit}>
                    {n_p_modal === 'new' ? "Register" : n_p_modal === 'edit' && "Update"}
                  </Button>
              }
            </Modal.Footer>
          </Modal>
        </>
      );
    }

    const getAcademicYear = (year_list !== undefined && year_list.length > 0) ? year_list.map((item, i) => {
        return(
            <option value={item._id} key={i}>{item.academic_year}</option>
        )
    }) : <option disabled>No Record Found</option>

    const getPosition = position_list ? position_list.map((item, i) => {
        return(
            <option value={item._id} id={i} key={i} name={item.position}>{item.position}</option>
        )
    }) : null

    const validate = Yup.object({
        name: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
        content: Yup.string()
          .min(15, 'Must be 15 characters or more')
          .required('Required'),
    })

    const handleSubmit = async (e) => {
        if(position_list.length === 0) return

        if(year_list !== undefined && year_list.length === 0) return

        if(!dataUri && !props.edit) {
          setRequire(true)
          return
        }
        else{
          if(!submited){
            let year = form.academic_year || year_list[0]._id
            let obj = {
                id : id ? id._id : '',
                image: dataUri,
                signature: signatureUri,
                name: e.name,
                position: form.position ? form.position : position_list[0]._id,
                quotes: form.quotes,
                message: e.content,
                academic_year: year
            }

            if(props.edit) dispatch(editMessage(obj))
            else dispatch(uploadMessage(obj))
            setSubmited(true)
          }
        }
    }
    
    return (
        <div className="wrap"> 
            {
              n_p_modal ?
                <NewPositionModal/>
                : null
            }
           
            <Modal show={show} onHide={handleClose} animation={true}>
              <Modal.Header className="example" closeButton>
                <Modal.Title>Crop Image</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{height:350}}>
                  <Cropper
                      image={dataUri}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 5}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                  />     
              </Modal.Body>
              <Modal.Footer>

                <Button variant="primary" disabled={preventspam} onClick={showCroppedImage}>
                    Crop
                </Button>
              </Modal.Footer>
            </Modal>
            {previewShow ? <PreviewModal/> : null}
            {signaturePreviewShow ? <SignaturePreviewModal/> : null}
            <Formik
                initialValues={{
                    name: '',
                    content: '',
                }}
                enableReinitialize={true} 
                initialValues={initialForm}
                validationSchema={validate}
                setSy
                onSubmit={(values, actions) => {
                    handleSubmit(values)
                }}
                >
                {formik => (
                    <div>
                    <Form>
                        <Button variant="primary" onClick={() => {props.setNew(false); props.setEdit("")}} style={{float:"right", borderRadius:0}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
                        <h2>{props.edit? "Edit Message" : "New Message"}</h2>
                        {
                          year_list !== undefined && year_list.length > 0 ?  
                            null
                            : 
                            <Alert variant="warning">
                                No Academic Year Found. Make sure you create one first <Link to={"/admin/template/new"} style={{ textDecoration: 'none' }}> Click Here </Link>
                            </Alert>
                        }
                        <Row>
                          <Col>                          
                              <FormGroup controlId="formFileSm" className="mb-3">
                                  <FormControl type="file" accept="image/*" onChange={(event) => onChange(event.target.files[0] || null)}/>
                                  { require ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                              </FormGroup>
                          </Col>
                          <Col>
                            { preview ? 
                              <Tooltip title={"Preview"}>
                                <Button variant="primary" style={{fontSize:15}} onClick={() => setPreviewShow(true)}><VisibilityIcon /></Button>
                              </Tooltip>: null}                 
                          </Col>
                        </Row>
                        <Row>
                          <Col>                          
                              <FormGroup controlId="formFileSm" className="mb-3">
                                  <FormLabel>Signature (if any)</FormLabel>
                                  <FormControl type="file" accept="image/*" onChange={(event) => onChangeSignature(event.target.files[0] || null)}/>
                                  {/* { require ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null }  */}
                              </FormGroup>
                          </Col>
                          <Col>
                            { signaturePreview ? 
                              <Tooltip title={"Preview"}>
                                <Button variant="primary" style={{fontSize:15, marginTop:30}} onClick={() => setSignaturePreviewShow(true)}><VisibilityIcon /></Button>
                              </Tooltip>: null}                 
                          </Col>
                        </Row>
                        <Row>
                              <Col>
                                <FormGroup as={Col} controlId="formGridEmail">
                                  <FormLabel>Select Academic Year</FormLabel>
                                  <FormSelect aria-label="Position" onChange={(e) => {setForm({...form, academic_year: e.target.value})}} >
                                      <option disabled>Select Academic Year...</option>
                                      {props.edit && <option style={{background:"yellow"}} value={initialForm.academic_year_id}>{initialForm.academic_year}</option>}
                                      {getAcademicYear}
                                  </FormSelect>
                                </FormGroup>
                              </Col>
                              <Col></Col>
                        </Row>
                        <Row className="mb-3">         
                            <Col>                 
                                <NormalTextField
                                  text ="Name"
                                  name="name"
                                />
                            </Col>
                            <Col>
                              <FormGroup controlId="formGridEmail">
                                <FormLabel>Select Position</FormLabel>
                                <FormSelect aria-label="Position" value={position} onChange={(e) => {setPosition(position_list[e.target.selectedOptions[0].id].name); setFocus(e.target.selectedOptions[0].id); setForm({...form, position: e.target.value})}} >
                                    <option disabled>Select Title Position...</option>
                                    {props.edit && <option style={{background:"yellow"}} value={initialForm.position}>{initialForm.position}</option>}
                                    {getPosition}
                                </FormSelect>
                              </FormGroup>
                              {
                                !props.edit ? 
                                <>
                                  <Button onClick={() => setNPModal('new')} style={{marginTop: 5, width:35, height: 35, padding:0, veticalAlign:"center"}} variant="primary"><Tooltip title={"New Position"}><AddIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}
                                  {
                                    position_list && position_list.length > 0 ? 
                                    <>
                                      <Button onClick={() => setNPModal('edit')} style={{marginTop: 5, width:35, height: 35, padding:0, veticalAlign:"center"}} variant="warning"><Tooltip title={"Edit Position"}><EditIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}
                                      <Button onClick={() => setNPModal('delete')} style={{marginTop: 5, width:35, height: 35, padding:0, veticalAlign:"center"}} variant="danger"><Tooltip title={"Delete Position"}><DeleteIcon style={{fontSize: 20}}/></Tooltip></Button>
                                    </> : null
                                  } 
                                  
                                </> : null
                              }
                              
                              { position_list && position_list.length === 0 ? <span style={{margin:"5px", color:"red", fontWeight:500}}>cannot be empty!</span> : null } 
                            </Col>
                              
                        </Row>
                        <FloatingLabel controlId="floatingTextarea" label="Quotes (if any)" className="mb-3">
                            <FormControl as="textarea" value={form.quotes} placeholder="Leave a comment here" onChange={(e) => {setForm({...form, quotes: e.target.value})}} />
                        </FloatingLabel>
                        <Col>
                            <TextArea
                              text ="Message Content"
                              name="content"
                              height={300}
                              maxLength={2100}
                            />
                        </Col>
                        <Button variant="primary" type="submit" disabled={(year_list !== undefined && year_list.length < 1)} style={{float:"right", margin:"10px 0"}} >
                            {props.edit ? "Update" : "Create"}
                        </Button>
                    </Form>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default Forms
