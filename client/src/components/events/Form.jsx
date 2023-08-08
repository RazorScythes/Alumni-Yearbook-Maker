import React, { useState, useCallback, useEffect } from 'react'
import { Row, Col, Button, Modal, FormSelect, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'
import Cropper from 'react-easy-crop'

import getCroppedImg from '../cropImage'
import { useDispatch, useSelector } from 'react-redux'
import { uploadEvents, editEvents, getEventYear, uploadNews, editNews } from '../../actions/events'

import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik';
import { TextArea, NormalTextField } from '../batch-template/TextArea'
import * as Yup from 'yup';

const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
})

export const EventForms = props => {
    const id = useSelector((state) => props.edit ? state.events.events_list.find((p) => p._id === props.edit) : null)

    const events = useSelector((state) => state.events)
    const year_list = useSelector((state) => state.events.academic_year)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getEventYear())
    }, [dispatch])

    useEffect(() => {
      if(events.message){
        props.setNew(false)
        props.setEdit("")
      }
    }, [events.message, events])

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [preventspam, setPreventSpam] = useState(false)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [show, setShow] = useState(false);

    const [preview, setPreview] = useState(false)
    const [previewShow, setPreviewShow] = useState(false)
    
    const [dataUri, setDataUri] = useState('')
    const [require, setRequire] = useState(false)
    const [form, setForm] = useState({
        academic_year: id ? id.academic_year._id : ''
    })

    const [initialForm, setInitialForm] = useState({
        name: id ? id.header : '',
        content: id ? id.content : '',
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
              <Modal.Body style={{height:400, margin:"auto"}}>
                  <img src={croppedImage} style={{maxHeight:400, width:"100%"}}/>   
              </Modal.Body>
            </Modal>
        )
    }

    const getAcademicYear = (year_list !== undefined && year_list.length > 0) ? year_list.map((item, i) => {
        return(
            <option value={item._id} key={i}>{item.academic_year}</option>
        )
    }) : <option disabled>No Record Found</option>

    const validate = Yup.object({
        name: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
        content: Yup.string()
          .min(15, 'Must be 15 characters or more')
          .required('Required'),
    })

    const handleSubmit = async (e) => {
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
                header: e.name,
                content: e.content,
                academic_year: year
            }

            if(props.edit) dispatch(editEvents(obj))
            else dispatch(uploadEvents(obj))
            setSubmited(true)
          }
        }
    }

    return (
        <div className="wrap"> 
            <Modal show={show} onHide={handleClose} animation={true}>
              <Modal.Header closeButton>
                <Modal.Title>Crop Image</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{height:350}}>
                  <Cropper
                      image={dataUri}
                      crop={crop}
                      zoom={zoom}
                      aspect={5 / 3.5}
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
                        <h2>{props.edit? "Edit Event" : "New Event"}</h2>
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
                            <NormalTextField
                                text ="Title"
                                name="name"
                              />
                        </Row>
                        <Col>
                            <TextArea
                              text ="Content"
                              name="content"
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

export const NewsForms = props => {
    const id = useSelector((state) => props.edit ? state.events.news_list.find((p) => p._id === props.edit) : null)

    const events = useSelector((state) => state.events)
    const year_list = useSelector((state) => state.events.academic_year)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getEventYear())
    }, [dispatch])

    useEffect(() => {
      if(events.message){
        props.setNew(false)
        props.setEdit("")
      }
    }, [events.message, events])

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [preventspam, setPreventSpam] = useState(false)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [show, setShow] = useState(false);

    const [preview, setPreview] = useState(false)
    const [previewShow, setPreviewShow] = useState(false)
    
    const [dataUri, setDataUri] = useState('')
    const [require, setRequire] = useState(false)
    const [form, setForm] = useState({
        academic_year: id ? id.academic_year._id : ''
    })

    const [initialForm, setInitialForm] = useState({
        name: id ? id.header : '',
        content: id ? id.content : '',
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
              <Modal.Body style={{height:400, margin:"auto"}}>
                  <img src={croppedImage} style={{maxHeight:400, width:"100%"}}/>   
              </Modal.Body>
            </Modal>
        )
    }

    const getAcademicYear = (year_list !== undefined && year_list.length > 0) ? year_list.map((item, i) => {
        return(
            <option value={item._id} key={i}>{item.academic_year}</option>
        )
    }) : <option disabled>No Record Found</option>

    const validate = Yup.object({
        name: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
        content: Yup.string()
          .min(15, 'Must be 15 characters or more')
          .required('Required'),
    })

    const handleSubmit = async (e) => {
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
                header: e.name,
                content: e.content,
                academic_year: year
            }

            if(props.edit) dispatch(editNews(obj))
            else dispatch(uploadNews(obj))
            setSubmited(true)
          }
        }
    }

    return (
        <div className="wrap"> 
            <Modal show={show} onHide={handleClose} animation={true}>
              <Modal.Header closeButton>
                <Modal.Title>Crop Image</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{height:350}}>
                  <Cropper
                      image={dataUri}
                      crop={crop}
                      zoom={zoom}
                      aspect={5 / 3}
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
                        <h2>{props.edit? "Edit News" : "New News"}</h2>
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
                            <NormalTextField
                                text ="Title"
                                name="name"
                              />
                        </Row>
                        <Col>
                            <TextArea
                              text ="Content"
                              name="content"
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

