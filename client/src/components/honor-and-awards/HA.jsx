import React, { useEffect, useState, useCallback } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { addHonorTitle, editHonorTitle, deleteHonorTitle, getHA, uploadHA, updateHA, deleteHA } from '../../actions/honors-and-awards';
import { Button, Row, Col, CloseButton, Alert, Modal, FormSelect, FormGroup, FormControl, FloatingLabel, Container, FormCheck } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { Paper } from '@material-ui/core';
import AddToolbar from './CustomToolbar/AddToolbar';
import './styles.css'

import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from "@material-ui/core/Tooltip";
import Cropper from 'react-easy-crop'

import getCroppedImg from '../cropImage'

import { Formik, Form } from 'formik';
import { NormalTextFieldXLabel, TextArea } from '../batch-template/TextArea';
import * as Yup from 'yup';
import { FormLabel } from '@material-ui/core';

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import TooltipHelper from '../TooltipHelper'
const honor_and_awards = [
    "Dean's List",
    "Academic Distinction",
    "Special Awards",
    "Dean's List with Distinction",
    "Highest Academic Distinction",
    "Cum Laude",
    "Magna Cum Laude",
    "Summa Cum Laude",
]

const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
})

const HA = props => {
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    const ha = useSelector((state) => state.ha)
    const ha_list = useSelector((state) => state.ha.ha_list)
    const honor_title = useSelector((state) => state.ha.title)

    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(getHA({academic_year: props.match.params.ay}))
    }, [dispatch])

    const [initialForm, setInitialForm] = useState({
        id: '',
        name: '',
    })

    const [form, setForm] = useState({
        quotes: '',
        message: ''
    })
    
    const [alert, setAlert] = useState({
        message: '',
        variant: '',
        box: false,
    });

    const [title, setTitle] = useState({
        id: '',
        display_name: ''
    })

    const [max, setMax] = useState({
        len: 0,
        max: 2100,
    })

    const [extend, setExtend] = useState(0)

    const [dataUri, setDataUri] = useState('')

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [preventspam, setPreventSpam] = useState(false)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [show, setShow] = useState(false);

    const [preview, setPreview] = useState(false)
    const [previewShow, setPreviewShow] = useState(false)
    const handleClose = () => setShow(false);

    useEffect(() => {
        if(ha.message){
            alertState(ha.message, ha.variant)
            ha.message = '' //prevent infinite render
            ha.variant = ''

            setEdit(false);
            // setUploadShow(false);
            if(honor_title.length > 0)
                if(honor_title[focus].enabled) setExtend(true)
                else setExtend(false)
        }
    }, [ha.message, ha])

    const onChange = (file) => {
        if(!file) {
          setDataUri('');
          return;
        }
    
        fileToDataUri(file)
          .then(dataUri => {
            setDataUri(dataUri)
            setShow(true)
          })
    }

    const alertState = (m, v) => {
        setAlert({...alert, message: m, variant: v, box: true})
    }

    const alertBox = () => {
        return (
            <Alert variant={alert.variant ? alert.variant : "success"}>
                {alert.message}
            </Alert>
        );
    }

    const [uploadShow, setUploadShow] = useState(0)
    const [edit, setEdit] = useState(0)

    const [deleteId, setDeleteId] = useState(0)

    const DeleteModals = props => {
        const currentAdmin = useSelector((state) => props.id ? state.ha.ha_list.find((p) => p._id === props.id) : null)
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            dispatch(deleteHA({
                id: currentAdmin._id,
                academic_year: props.ay,
            }))
            props.setDeleteId(false)
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion {currentAdmin.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to continue?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }

    const columns = [
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "title",
            label: "Honors / Awards",
            options: {
                filter: true,
                sort: false,
            }
        },
            {
            name: "action",
            label: "Action",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>  
                            <Button variant="warning" style={{fontSize:15}} onClick={() => {
                                setInitialForm({ ...initialForm,
                                    id: ha_list[tableMeta.rowIndex]._id,
                                    name: tableMeta.rowData[0],
                                })
                                setTitle({...title, id: ha_list[tableMeta.rowIndex].title_id, display_name: ha_list[tableMeta.rowIndex].title})
                                setUploadShow(1); 
                                setShowNewHonor(false)
                                setEdit(1);

                                ha_list[tableMeta.rowIndex].props.enabled ?  
                                    setExtend(true) 
                                    : 
                                    setExtend(false)

                                    setForm({...form, 
                                        quotes: ha_list[tableMeta.rowIndex].quotes,
                                        message: ha_list[tableMeta.rowIndex].message
                                    })

                             }}><i className="bx bxs-edit"></i></Button>
                            { user?.result.role !== restricted_roles && <Button variant="danger" style={{fontSize:15, marginLeft:5}} onClick={() => setDeleteId(ha_list[tableMeta.rowIndex]._id)}><i className="bx bx-trash"></i></Button> }
                        </>
                    )
                }
            }
        },
    ];

    const handleSubmit  = (e) => {
        if(honor_title.length === 0) return

        if(edit){
            dispatch(updateHA({
                academic_year: props.match.params.ay,
                id: initialForm.id,
                name: e.name,
                title: title.id ? title : {
                    id: honor_title[focus]._id,
                    display_name: honor_title[focus].title
                },
                quotes: form.quotes,
                message: form.message,
                image: dataUri
            }))

            setUploadShow(false);
        }
        else{
            dispatch(uploadHA({
                academic_year: props.match.params.ay,
                name: e.name,
                title: title.id ? title : {
                    id: honor_title[focus]._id,
                    display_name: honor_title[focus].title
                },
                quotes: form.quotes,
                message: form.message,
                image: dataUri
            }))
        }

        setExtend(false)
        setInitialForm({ ...initialForm,
            name: '',
            position: ''
        })
        setForm({...form, 
            quotes: '',
            message: ''
        })
        setDataUri('')
        setPreview(false)
        setTitle({
            ...title,
            id: honor_title[focus]._id,
            display_name: honor_title[focus].title
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

    const handleToolbar = (e) => {
        setUploadShow(e)
        if(honor_title.length > 0)
            if(honor_title[focus].enabled) setExtend(true)
    }

    const options = {
        selectableRows: 'none', 
        filterType: 'checkbox',
        viewColumns: false,
        download: false,
        filter: false,
        print: false,
        responsive: "standard",
        customToolbar: () => {
            return (
                <>
                    {
                        user?.result.role !== restricted_roles &&
                            <AddToolbar 
                                bool={handleToolbar}
                            />
                    }
                </>
            );
        },
    };
    
    const validate = Yup.object({
        name: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
    })

    const getHAList = honor_and_awards.map((item) => {
        return(
            <option value={item}>{item}</option>
        )
    })

    const Submit_Honor = () => {
        if(honorForm.title.length == 0) {
            setRequired(1)
            return
        }

        if(!editHonor) dispatch(addHonorTitle(honorForm))
        else {
            dispatch(editHonorTitle({
                academic_year: props.match.params.ay,
                form: honorForm
            }))
            setShowNewHonor(false)
            setUploadShow(true)
        }

        setHonorForm({
            ...honorForm,
            id: '',
            title:'',
            desc: '',
            enabled: false,
            priority_value: 1
        })
    }

    const [honorForm, setHonorForm] = useState({
        id: '',
        title:'',
        desc: '',
        enabled: false,
        priority_value: 1
    })

    const [newHonor, setShowNewHonor] = useState(false)
    const [required, setRequired] = useState(0)
    const [focus, setFocus] = useState(0)
    const [editHonor, setEditHonor] = useState(false)
    const [deleteHonor, setDeleteHonor] = useState('')


    const get_title = honor_title ? honor_title.map((item, i) => {
        return (
            <option key={i} id={i} value={item.title}>{item.title}</option>
        )
    }) : null
    


    const DeleteTitle = props => {
        const [show, setShow] = useState(true);
        const handleClose = () => {
            props.setDeleteHonor('')
        };

        const handleDelete = () => {
            dispatch(deleteHonorTitle({
                id: props.data,
                academic_year: props.acad
            }))
            setShow(0)
            setFocus(0)
            props.setDeleteHonor('')

            setUploadShow(false)
            setUploadShow(true)
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Deleting Title <span style={{color: "red", fontWeight:500}}>{props.data.title ? props.data.title : honor_title[focus].title}</span></p>
                    <p>Are you sure you want to delete this?</p>
                    <p style={{color: "red", fontWeight:500}}>
                        it will also remove all the related data attatch to this position (All Academic Year Related)
                    </p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }

    return (
        <div style={{padding:20}}>

            <Link to={`/admin/honor&awards`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
            </Link>
            <Modal show={show} onHide={handleClose} animation={true}>
              <Modal.Header closeButton>
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
            {alert.box ? alertBox() : null}
            {
                deleteId ? 
                <DeleteModals
                    setDeleteId={setDeleteId}
                    id={deleteId}
                    ay={props.match.params.ay}
                /> : null
            }  
            {
                deleteHonor ?
                <DeleteTitle
                    data={honor_title[focus]._id}
                    acad={props.match.params.ay}
                    setDeleteHonor={setDeleteHonor}
                />
                : null
            }
            {
                newHonor ?
                    <Paper elevation={2} style={{marginBottom:5, padding: 10}}>
                        <div>
                            <CloseButton style={{float:"right"}} onClick={() => {
                                    setUploadShow(false);
                                    // setExtend(false)
                                    setEdit(false);
                                    setInitialForm({ ...initialForm,
                                        name: '',
                                    })
                                    setForm({...form, 
                                        quotes: '',
                                        message: ''
                                    })
                                    setDataUri('')
                                    setPreview(false)
                                    setTitle({
                                        ...title,
                                        id: honor_title.length > 0 ? honor_title[focus]._id : '',
                                        display_name: honor_title.length > 0 ? honor_title[focus].title : ''
                                    })

                                    setShowNewHonor(false)
                                    setEditHonor(false)
                                    setUploadShow(true);
                                    setFocus(0)
                                    setHonorForm({
                                        ...honorForm,
                                        id: '',
                                        title:'',
                                        desc: '',
                                        enabled: false,
                                        priority_value: 1
                                    })
                                }
                            }/>
                            {editHonor ? <h5>Edit Title</h5> : <h5>New Title</h5>}
                            <hr style={{margin:5}}/>
                        </div>
                        <Container>
                            <Row>
                                <Col>
                                    <FormGroup className="mb-3" controlId="exampleForm.ControlInput1">
                                        <FormLabel style={{color: "#000"}} >Honor Title</FormLabel>
                                        <FormControl onChange={(e) => {
                                            setHonorForm({...honorForm, title: e.target.value})
                                            e.target.value.length > 0 ? setRequired(0) : setRequired(1)
                                            }} value={honorForm.title} type="text" placeholder="Enter Title" />
                                        { required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <div style={{display:"flex", marginTop:30}}>
                                    <FormCheck 
                                        type="checkbox"
                                        id={`default-checkbox`}
                                        label={`Enable Message Field`}
                                        checked={honorForm.enabled}
                                        onClick={() => setHonorForm({...honorForm, enabled: !honorForm.enabled})}
                                    />
                                        <div style={{marginTop:-10}}>
                                            <TooltipHelper
                                                text={"Adds the message input when adding an / a honor students (it is not recommended and you can leave it blank)"}                                
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <FormLabel style={{color: "#000"}}>Description for Title (Optional)</FormLabel>
                                        <FormControl maxLength={100} onChange={(e) => setHonorForm({...honorForm, desc: e.target.value})} value={honorForm.desc} as="textarea" rows={3} />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup className="mb-3" controlId="exampleForm.ControlInput1">
                                        <div>
                                            <FormLabel style={{color: "#000"}}>Priority Value</FormLabel>
                                            <TooltipHelper
                                                text={"Indicator of who will popup first. The higher the value it is more likely shows up first."}                                
                                            />
                                        </div>
                                        
                                        <FormControl onChange={(e) => setHonorForm({...honorForm, priority_value: e.target.value})} value={honorForm.priority_value} style={{width:70}} type="number" min="1"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div style={{width:"100%", display:"inline-block"}}>
                                <button onClick={Submit_Honor} className="btn btn-dark mt-3" style={{float:"right", margin:0, marginRight:10}} type="submit">{editHonor ? 'Update' : 'Register'}</button>
                            </div>  
                        </Container>
                    </Paper>
                : null
            }




            {
                uploadShow ?
                <Paper elevation={2} style={{marginBottom:5, padding: 10}}>
                <Formik
                    initialValues={{
                        name: '',
                    }}
                    enableReinitialize={true} 
                    initialValues={initialForm}
                    validationSchema={validate}
                    setSy
                    onSubmit={(values, { resetForm }) => {
                        handleSubmit(values)
                        resetForm();
                    }}
                    >
                    {formik => (
                        <div>
                        <div>
                            <CloseButton style={{float:"right"}} onClick={() => {
                                    setUploadShow(false);
                                    setExtend(false)
                                    setEdit(false);
                                    setInitialForm({ ...initialForm,
                                        name: '',
                                    })
                                    setForm({...form, 
                                        quotes: '',
                                        message: ''
                                    })
                                    setDataUri('')
                                    setPreview(false)
                                    setTitle({
                                        ...title,
                                        id: honor_title.length > 0 ? honor_title[focus]._id : '',
                                        display_name: honor_title.length > 0 ? honor_title[focus].title : ''
                                    })

                                    
                                    setFocus(0)
                                }
                            }/>
                            {edit ? <h5>Update Honor and Awards</h5> : <h5>New Honor and Awards</h5>}
                            <hr style={{margin:5}}/>
                        </div>
                        <Form>
                            <Row>
                            <Col>
                                    <FormLabel style={{color: "#000"}}>Honor Title</FormLabel>
                                    <FormSelect aria-label="Title" style={{marginTop:5}}
                                        value={title.display_name}
                                        onChange={(e) => {
                                            setTitle({
                                                id: honor_title[e.target.selectedOptions[0].id]._id,
                                                display_name: honor_title[e.target.selectedOptions[0].id].title
                                            })
                                            honor_title[e.target.selectedOptions[0].id].enabled ? setExtend(true) : setExtend(false)
                                            setForm({...form, 
                                                quotes: '',
                                                message: ''
                                            })
                                            setDataUri('')
                                            setPreview(false)
                                            

                                            setFocus(e.target.selectedOptions[0].id)
                                        }}>
                                        <option disabled>Select Title...</option>
                                        {get_title}
                                    </FormSelect>   
                                    {   !edit ?
                                            <>                                               
                                                {
                                                    user?.result.role !== restricted_roles &&
                                                        <>
                                                            <Button onClick={() => {
                                                                setHonorForm({
                                                                    ...honorForm,
                                                                    id: '',
                                                                    title:'',
                                                                    desc: '',
                                                                    enabled: false,
                                                                    priority_value: 1
                                                                })
                                                                setEditHonor(false)
                                                                setShowNewHonor(true)
                                                                setUploadShow(false);
                                                            }} style={{marginTop: 5, width:35, height: 35, padding:0, veticalAlign:"center"}} variant="primary"><Tooltip title={"New Title"}><AddIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}
                                                            
                                                            {
                                                                honor_title.length > 0 ?
                                                                <>         
                                                                    <Button onClick={() => {
                                                                        setHonorForm({
                                                                            ...honorForm,
                                                                            id: honor_title[focus]._id,
                                                                            title: honor_title[focus].title,
                                                                            desc: honor_title[focus].desc,
                                                                            enabled: honor_title[focus].enabled,
                                                                            priority_value: honor_title[focus].priority_value
                                                                        })
                                                                        setEditHonor(true)
                                                                        setShowNewHonor(true)
                                                                        setUploadShow(false);
                                                                    }} style={{marginTop: 5, width:35, height: 35, padding:0, veticalAlign:"center"}} variant="warning"><Tooltip title={"Edit Title"}><EditIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}            
                                                                    
                                                                    <Button onClick={() => {
                                                                        setDeleteHonor(honor_title[focus]._id)
                                                                    }} style={{marginTop: 5, width:35, height: 35, padding:0, veticalAlign:"center"}} variant="danger"><Tooltip title={"Delete Title"}><DeleteIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}                                                                                                                                                                                            
                                                                </>
                                                                : null 
                                                            }
                                                        </>   
                                                }
                                                                                            
                                            </>
                                        : null
                                    }                                               
                                </Col>
                                <Col>
                                    <FormLabel style={{color: "#000"}}>Full Name</FormLabel>
                                    <NormalTextFieldXLabel
                                        text ="Full Name"
                                        name="name"
                                    />
                                    {
                                        !extend ? 
                                            <div style={{width:"100%", display:"inline-block"}}>
                                                <button className="btn btn-dark mt-3" style={{float:"right", margin:0, marginRight:10}} type="submit">{edit ? 'Update' : 'Register'}</button>
                                            </div> : null
                                    }
                                </Col>
                            </Row>
                            {
                                extend ? 
                                <>
                                <Alert variant="info" style={{margin:"10px 0"}}>
                                    <span style={{fontWeight:500}}>This part is optional for the honor student, you can leave it blank if he/she doesn't have message/speech.</span>
                                </Alert>
                                <Row>
                                    <Col>                          
                                        <FormGroup controlId="formFileSm" className="mb-3">
                                            <FormLabel>Image</FormLabel>
                                            <FormControl type="file" accept="image/*" onChange={(event) => onChange(event.target.files[0] || null)}/>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        { preview ? 
                                        <Tooltip title={"Preview"}>
                                            <Button variant="primary" style={{fontSize:15, marginTop:23}} onClick={() => setPreviewShow(true)}><VisibilityIcon /></Button>
                                        </Tooltip>: null}                 
                                    </Col>
                                </Row>
                                <FloatingLabel controlId="floatingTextarea" label="Quotes (if any)" className="mb-3">
                                    <FormControl as="textarea" value={form.quotes} placeholder="Leave a comment here" onChange={(e) => {setForm({...form, quotes: e.target.value})}} />
                                </FloatingLabel>
                                <Col>
                                    <FloatingLabel label='Message'>
                                        <FormControl
                                            value={form.message}
                                            onChange={(e) => {
                                                setForm({...form, message: e.target.value})
                                                setMax({...max, len: e.target.value.length})
                                            }}
                                            as="textarea"
                                            placeholder="Leave a comment here"
                                            style={{ height: '100px' }}
                                            maxLength={max.max}
                                        />
                                        <span style={{color: "gray"}}>{max.len} / {max.max}</span>
                                    </FloatingLabel>
                                </Col>
                                <div style={{width:"100%", display:"inline-block"}}>
                                    <button className="btn btn-dark mt-3" style={{float:"right", margin:0, marginRight:10}} type="submit">{edit ? 'Update' : 'Register'}</button>
                                </div>  
                                </> : null
                            }                        
                        </Form>
                        </div>
                    )}
                </Formik>
                </Paper> : null
            }
            {
                <MUIDataTable
                    title={`Honors and Awards (${props.match.params.ay})`}
                    data={ha_list && ha_list}
                    columns={columns}
                    options={options}
                />
            }
        </div>
    )
}

export default HA
