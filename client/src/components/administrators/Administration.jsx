import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getAdministrators, editAdministration, addAdministration, deleteAdministration, getLatestContent, getAdminContent, getAdminYear, uploadAdministrators, updateAdministrators, deleteAdministrators } from '../../actions/administrators';
import { Button, Row, Col, CloseButton, Alert, Modal, FormGroup, FormLabel, FormControl, FormSelect, ListGroup, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { Paper } from '@material-ui/core';
import AddToolbar from './CustomToolbar/AddToolbar';
import './styles.css'

import { Formik, Form } from 'formik';
import { TextAreaS, TextField, NormalTextField } from '../batch-template/TextArea';
import * as Yup from 'yup';

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";

const administration_list = [
    'Board of Trustees',
    'Example Administration',
]

const Administration = () => {
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    const year_list = useSelector((state) => state.administrators.academic_year)

    const administrators = useSelector((state) => state.administrators)
    const admins = useSelector((state) => state.administrators.administration)

    const [status, setStatus] = useState('')
    const [form, setForm] = useState({
        id: '',
        title: ''
    })

    const [title, setTitle] = useState('')
    const [listTitle, setList] = useState([])
    const [requiredT, setRequiredT] = useState({
        validate: false,
        error: ''
    })

    const [required, setRequired] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAdminYear())
        dispatch(getLatestContent())
    }, [])

    const [id, setId] = useState('')
    const [adminis, setAdministration] = useState('')
    
    const getContent = ( id) => {
        setId(id)
        dispatch(getAdminContent({
            academic_year: id,
            administration: adminis ? adminis : admins.title[0].title
        }))

        setUploadShow(false);
        setEdit(false);
        setInitialForm({ ...initialForm,
            name: '',
            position: ''
        })
    }

    const getAdminist = (title) => {
        setAdministration(title)
        dispatch(getAdminContent({
            academic_year: id ? id : year_list[0]._id,
            administration: title
        }))
    }

    const [initialForm, setInitialForm] = useState({
        id: '',
        name: '',
        position: '',
        administration: ''
    })

    const [alert, setAlert] = useState({
        message: '',
        variant: '',
        box: false,
    });

    useEffect(() => {
        if(administrators.message){
            alertState(administrators.message, administrators.variant)
            administrators.variant = '' //prevent infinite render
            administrators.message = '' //prevent infinite render

            setEdit(false);
            setUploadShow(false);
            setFile(null);
            setList([]);
        }
    }, [administrators.message, administrators])

    const alertState = (m, v) => {
        setAlert({...alert, message: m, variant: v, box: true})
    }

    const alertBox = () => {
        return (
            <Alert variant={alert.variant ? alert.variant : 'success'}>
                {alert.message}
            </Alert>
        );
    }

    const [uploadShow, setUploadShow] = useState(0)
    const [edit, setEdit] = useState(0)

    const [deleteId, setDeleteId] = useState(0)
    const [admindel, setAdminDel] = useState(0)
    const [year, setYear] = useState('')

    const AdminDelete = props => {
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setAdminDel(false)
        };

        const handleDelete = () => {
            dispatch(deleteAdministration({
                id: props.data.id ? props.data.id : admins.title[focus]._id,
                title: props.data.title ? props.data.title : admins.title[focus].title,
                academic_year: year ? year : year_list[0]._id
            }))
            setForm({...form, title: '', id: ''})
            setShow(false)
            props.setAdminDel(false)
            setFocus(0)
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete {props.data.title ? props.data.title : admins.title[focus].title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    All the data related to this will also be removed. Do you want to continue?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }

    const DeleteModals = props => {
        const currentAdmin = useSelector((state) => props.id ? state.administrators.administration.admin.find((p) => p._id === props.id) : null)
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            dispatch(deleteAdministrators({
                id: currentAdmin._id,
                academic_year: props.ay,
                administration: currentAdmin.administration._id,
            }))
            props.setDeleteId(false)
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete {currentAdmin.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to continue?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }

    const [multiData, setData] = useState(null)

    const MultipleDelete = props => {
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setData(null)
        };

        const handleDelete = () => {
            dispatch(deleteAdministrators({
                data: props.data,
                academic_year: props.ay,
                administration: props.data[0].administration._id,
            }))
            props.setData(null)
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete {props.data.length} selected administation?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                    Delete
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
            name: "position",
            label: "Position/s",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>  
                            {value.join(" / ")}
                        </>
                    )
                }
            }
        },
        {
            name: "image",
            label: "Image",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(value)
                        return (
                            <>  
                                <img src={value} style={{width: 75, height: 75, border: "1px solid red", objectFit: "cover"}}/>
                            </>
                        )
                }
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
                                    id: admins.admin[tableMeta.rowIndex]._id,
                                    administration: admins.admin[tableMeta.rowIndex].administration._id,
                                    name: tableMeta.rowData[0],
                                    position: tableMeta.rowData[1]
                                })

                                setList(tableMeta.rowData[1])
                                setUploadShow(1); 
                                setEdit(1);
                             }}><i className="bx bxs-edit"></i></Button>
                            { user?.result.role !== restricted_roles && <Button variant="danger" style={{fontSize:15, marginLeft:5}} onClick={() => setDeleteId(admins.admin[tableMeta.rowIndex]._id)}><i className="bx bx-trash"></i></Button> }
                        </>
                    )
                }
            }
        },
    ];

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const [image, setImage] = useState(null)

    const [fileimage, setFile] = useState(null)

    const convert_image = async (e) => {
        setFile(e.target.value)
        let convert
        if(e.target.files[0] && e.target.files[0]['type'].split('/')[0] === 'image'){
            convert = await toBase64(e.target.files[0])
            setImage(convert)
        }
    }
    
    const handleSubmit  = (e, resetForm) => {
        if(edit){
            dispatch(updateAdministrators({
                academic_year: id ? id : year_list[0]._id,
                image: image,
                id: initialForm.id,
                administration: initialForm.administration,
                name: e.name,
                position: listTitle
            }))

            setInitialForm({ ...initialForm,
                id: '',
                name: '',
                position: '',
                administration: ''
            })
        }
        else{
            if(listTitle.length > 0){
                dispatch(uploadAdministrators({
                    academic_year: id ? id : year_list[0]._id,
                    administration: admins.title[focus]._id,
                    image: image,
                    name: e.name,
                    position: listTitle
                }))

                setList([])
                resetForm()
            }
            else if(title.length > 0){
                setRequiredT({...requiredT, validate: true, error: "Click the 'Add Position' to continue"})
                return
            }
            else {
                setRequiredT({...requiredT, validate: true, error: "Required"})
                return
            }
        }
        setImage(null)
        setFile('')
    }

    const handleToolbar = (e) => {
        setUploadShow(e)
    }

    const options = {
        // selectableRows: 'none', 
        filterType: 'checkbox',
        viewColumns: false,
        download: false,
        filter: false,
        print: false,
        responsive: "standard",
        customToolbar: () => {
            return (
                <>
                    <AddToolbar 
                         bool={handleToolbar}
                    />
                </>
            );
        },
        onRowsDelete:(e)=>{
            let arr = []
            e.data.forEach((item) => {
                arr.push(admins.admin[item.index])
            })
            setData(arr)
        }
    };
   
    const validate = Yup.object({
        name: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required')
    })

    const newAdmin = () => {
        if(form.title.length == 0) setRequired(true)
        else{
            setRequired(false)
            dispatch(addAdministration(form))
            setStatus('')
            // setForm('')
        }
    }

    const editAdmin = () => {
        if(form.title.length == 0) setRequired(true)
        else{
            setRequired(false)
            dispatch(editAdministration(form))
            setStatus('')
            setAdministration('')
        }
    }
    const [focus, setFocus] = useState(0)
    const administrations = admins ? admins.title.map((item, i) => {
        return (
            <option value={i} index={i} id={item._id}>{item.title}</option>
        )
    }) : null

    
    const year_option = year_list ? year_list.map((item, i) => {
        return (
            <option value={item._id}>A.Y {item.academic_year}</option>
        )
    }) : null
    
    const addProgram = () => {
        if(!title) setRequiredT({...requiredT, validate: true, error: "Required"})
        else {
            let newTitle = title
            let duplicate = false

            listTitle.forEach(item => { if(newTitle === item) duplicate = true })

            if(duplicate) {
                setTitle('')
                return
            }

            setRequiredT({...require, validate: false, error: ''})
            
            setList(listTitle.concat(newTitle))

            setTitle('')
        }
    }


    const deleteProgram = (e) => {
        var arr = listTitle
        arr.splice(e.currentTarget.id, 1)
        setList([...arr])
    }

    const title_list = listTitle.map((item, index) => {
        return (
            <ListGroup.Item key={index} as="li">{item}<Button id={index} onClick={deleteProgram} style={{float: "right", width:30, height: 30, fontSize: 5, padding:0, veticalAlign:"center"}} variant="danger"><Tooltip title={"Remove"}><DeleteIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}</ListGroup.Item>
        )
    })

    return (
        <div className="wrap">
            {
                ( year_list !== undefined && year_list.length > 0 ) ?
                    year_option &&
                    <>  
                        <Row style={{marginBottom:10}}>
                            <Col>
                                <FormSelect 
                                    onChange={(e) => {
                                        getContent(e.target.value)
                                        setYear(e.target.value)
                                        !uploadShow && setList([])
                                    }}
                                >
                                    {year_option}
                                </FormSelect>
                            </Col>
                            <Col></Col>
                        </Row>  
                                <Row style={{marginBottom:10, display: !status ? "flex" : "none"}}>
                                        <Col>
                                            <FormSelect 
                                                onChange={(e) => {
                                                    setFocus(e.target.value)
                                                    getAdminist(admins.title[e.target.value].title)
                                                    setForm({...form, title: admins.title[e.target.value].title, id: admins.title[e.target.value]._id})
                                                    !uploadShow && setList([])
                                                }}
                                            >
                                                {
                                                    admins && admins.title.length > 0 ?
                                                        administrations
                                                        :
                                                        <option value="" disabled>No administration available</option>
                                                }
                                            </FormSelect>
                                        </Col>
                                        <Col> 
                                            {
                                                user?.result.role !== restricted_roles &&
                                                <>
                                                    <Button onClick={() => {setStatus('new'); setForm({...form, title: '', id: ''})}} style={{width:35, height: 35, padding:0, veticalAlign:"center"}} variant="primary"><Tooltip title={"New Administration"}><AddIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}
                                                    {
                                                        admins && admins.title.length > 0 ?
                                                        <>
                                                            <Button onClick={() => {
                                                                setStatus('edit')
                                                                setForm({...form,  title : admins.title[focus].title, id: admins.title[focus]._id})
                                                            }} style={{width:35, height: 35, padding:0, veticalAlign:"center"}} variant="warning"><Tooltip title={"Edit Administration"}><EditIcon style={{fontSize: 20}}/></Tooltip></Button>{' '}
                                                            <Button onClick={() => setAdminDel(true)} style={{width:35, height: 35, padding:0, veticalAlign:"center"}} variant="danger"><Tooltip title={"Delete Administration"}><DeleteIcon style={{fontSize: 20}}/></Tooltip></Button>
                                                        </>
                                                        : null
                                                    }
                                                </>
                                            }                                                        
                                       </Col>
                                </Row>
                                <Row style={{marginBottom:10}}>                           
                                        
                                    {
                                        status === "new" ?
                                        <>
                                            <Col>
                                                <FormControl value={form.title} onChange={(e) => {
                                                    setForm({...form, title: e.target.value, id: ''})
                                                    e.target.value.length > 0 ? setRequired(false) : setRequired(true)
                                                }}size="md" type="text" autoFocus placeholder="Enter New Administration" />
                                                { required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                                            </Col>
                                            <Col> 
                                                    <Button onClick={newAdmin} style={{width:50, height: 35, padding:0, fontSize:15, veticalAlign:"center"}} variant="primary">Add</Button>{' '}
                                                    <Button onClick={() => {setStatus(''); setForm({...form, title: '', id: ''})}} style={{width:70, height: 35, padding:0, fontSize:15, veticalAlign:"center"}} variant="danger">Cancel</Button>
                                            </Col>
                                        </>
                                        :
                                        status === "edit" ?
                                        <>
                                            <Col>
                                                <FormControl value={form.title} size="md" onChange={(e) => {
                                                    setForm({...form, title: e.target.value})
                                                    e.target.value.length > 0 ? setRequired(false) : setRequired(true)
                                                }} type="text" autoFocus placeholder="Edit Administration" />
                                                { required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                                            </Col>
                                            <Col> 
                                                    <Button onClick={editAdmin} style={{height: 35, fontSize:15, veticalAlign:"center"}} variant="success">Save Changes</Button>{' '}
                                                    <Button onClick={() => {setStatus('')}} style={{width:70, height: 35, padding:0, fontSize:15, veticalAlign:"center"}} variant="danger">Cancel</Button>
                                            </Col>
                                        </>
                                        : null
                                    }
                                </Row>
                    </> 
                : !alert.box &&
                    <Alert variant="warning">
                        No Academic Year Found. Make sure you create one first <Link to={"/admin/template/new"} style={{ textDecoration: 'none' }}> Click Here </Link>
                    </Alert>
            }

            {alert.box ? alertBox() : null}
            {
                ( year_list !== undefined && year_list.length > 0 ) ?
                    year_option &&
                    <>
                        {
                            deleteId ? 
                            <DeleteModals
                                setDeleteId={setDeleteId}
                                id={deleteId}
                                ay={id ? id : year_list[0]._id}
                            /> : null
                        }  
                        {
                            admindel ? 
                            <AdminDelete
                                data={form}
                                setAdminDel={setAdminDel}
                            />
                            : null
                        }
                        {
                            multiData ? 
                            <MultipleDelete
                                data={multiData}
                                setData={setData}
                                ay={id ? id : year_list[0]._id}
                            /> : null
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
                                    handleSubmit(values, resetForm)
                                    //resetForm();
                                }}
                                >
                                {formik => (
                                    <div>
                                    <div>
                                        <CloseButton style={{float:"right"}} onClick={() => {
                                                setUploadShow(false);
                                                setEdit(false);
                                                setInitialForm({ ...initialForm,
                                                    name: '',
                                                })
                                                setList([])
                                            }
                                        }/>
                                        {edit ? <h5>Update {adminis ? adminis : (admins && admins.title.length) > 0 ? admins.title[focus].title : "(Add administration title first)"}</h5> : <h5>New {adminis ? adminis : (admins && admins.title.length) > 0 ? admins.title[focus].title : "(Add administration title first)"}</h5>}
                                        <hr style={{margin:5}}/>
                                    </div>
                                    <FormGroup controlId="formFileSm" className="mb-3">
                                        <Row>
                                            <Col>
                                                <FormLabel>Photo 2x2 (optional)</FormLabel>
                                                <FormControl type="file" value={fileimage} accept="image/*" onChange={convert_image} size="sm" />
                                            </Col>
                                            <Col></Col>
                                        </Row>                                    
                                    </FormGroup>
                                    <Form>
                                        <Row>
                                            <Col xs={6}>
                                                <NormalTextField
                                                    text ="Name"
                                                    name="name"
                                                />
                                            </Col>
                                            <Col xs={5}>
                                                <FormGroup as={Col} controlId="formGridEmail" style={{margin:"5px 0"}}>
                                                    <FormLabel>Position</FormLabel>
                                                    <FormControl value={title} type="text" placeholder={`Enter Position`} onChange={(e) => setTitle(e.target.value)} />
                                                </FormGroup>
                                                { requiredT.validate ? <span style={{margin:"5px", color:"red", fontWeight:500}}>{requiredT.error}</span> : null } 
                                            </Col>
                                            <Col xs={1}>
                                                <Button  onClick={addProgram} style={{padding: 0, width: 30, height: 30, marginTop: 40, veticalAlign:"center"}} variant="primary"><Tooltip title={"Add Position"}><AddIcon/></Tooltip></Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}></Col>
                                            <Col xs={5}>
                                                    {
                                                        listTitle.length > 0 ?
                                                            <Col style={{border: "1px solid gray", wordBreak:"break-all"}}>
                                                                <ListGroup as="ol" numbered={true}>
                                                                    {title_list}
                                                                </ListGroup>            
                                                            </Col>
                                                        : null
                                                    }
                                            </Col>
                                        </Row>
                                        <div style={{width:"100%", display:"inline-block"}}>
                                            <button className="btn btn-dark mt-3" style={{float:"right", margin:0, marginRight:10}} type="submit">{edit ? 'Update' : 'Register'}</button>
                                        </div>
                                    </Form>
                                    </div>
                                )}
                            </Formik>
                            </Paper> : null
                        }
                        <MUIDataTable
                            title={`${adminis ? adminis : (admins && admins.title.length) > 0 ? admins.title[focus].title : 'No Administration Set'}`}
                            data={admins && admins.admin}
                            columns={columns}
                            options={options}
                        />
                    </> : null
            }

        </div>
    )
}

export default Administration
