import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getAdministrators, uploadAdministrators, updateAdministrators, deleteAdministrators } from '../../actions/administrators';
import { Button, Row, Col, CloseButton, Alert, Modal, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { Paper } from '@material-ui/core';
import AddToolbar from './CustomToolbar/AddToolbar';
import './styles.css'

import { Formik, Form } from 'formik';
import { TextAreaS, TextField } from '../batch-template/TextArea';
import * as Yup from 'yup';
const Administrators = props => {
    const administrators = useSelector((state) => state.administrators)
    const admins = useSelector((state) => state.administrators.admins)

    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(getAdministrators({academic_year: props.match.params.ay}))
    }, [dispatch])

    const [initialForm, setInitialForm] = useState({
        id: '',
        name: '',
        position: ''
    })

    const [alert, setAlert] = useState({
        message: '',
        box: false,
    });

    useEffect(() => {
        if(administrators.message){
            alertState(administrators.message)
            administrators.message = '' //prevent infinite render

            setEdit(false);
            setUploadShow(false);
        }
    }, [administrators.message, administrators])

    const alertState = (m) => {
        setAlert({...alert, message: m, box: true})
    }

    const alertBox = () => {
        return (
            <Alert variant="success">
                {alert.message}
            </Alert>
        );
    }

    const [uploadShow, setUploadShow] = useState(0)
    const [edit, setEdit] = useState(0)

    const [deleteId, setDeleteId] = useState(0)

    const DeleteModals = props => {
        const currentAdmin = useSelector((state) => props.id ? state.administrators.admins.find((p) => p._id === props.id) : null)
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            dispatch(deleteAdministrators({
                id: currentAdmin._id,
                academic_year: props.ay,
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
                                    id: admins[tableMeta.rowIndex]._id,
                                    name: tableMeta.rowData[0],
                                    position: tableMeta.rowData[1]
                                })
                                setUploadShow(1); 
                                setEdit(1);
                             }}><i className="bx bxs-edit"></i></Button>
                            <Button variant="danger" style={{fontSize:15, marginLeft:5}} onClick={() => setDeleteId(admins[tableMeta.rowIndex]._id)}><i className="bx bx-trash"></i></Button>
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
    
    const convert_image = async (e) => {
        let convert
        if(e.target.files[0] && e.target.files[0]['type'].split('/')[0] === 'image'){
            convert = await toBase64(e.target.files[0])
            console.log(convert)
            setImage(convert)
        }
    }
    
    const handleSubmit  = (e) => {
        if(edit){
            dispatch(updateAdministrators({
                academic_year: props.match.params.ay,
                image: image,
                id: initialForm.id,
                name: e.name,
                position: e.position
            }))

            setInitialForm({ ...initialForm,
                id: '',
                name: '',
                position: ''
            })
            setImage(null)
        }
        else{
            dispatch(uploadAdministrators({
                academic_year: props.match.params.ay,
                image: image,
                name: e.name,
                position: e.position
            }))
            setImage(null)
        }
    }

    const handleToolbar = (e) => {
        setUploadShow(e)
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
                    <AddToolbar 
                         bool={handleToolbar}
                    />
                </>
            );
        },
    };
    
    const validate = Yup.object({
        name: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
        position: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
    })

    return (
        <div style={{padding:20}}>
            <Link to={`/admin/administrators`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
            </Link>
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
                uploadShow ?
                <Paper elevation={2} style={{marginBottom:5, padding: 10}}>
                <Formik
                    initialValues={{
                        name: '',
                        position: '',
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
                                    setEdit(false);
                                    setInitialForm({ ...initialForm,
                                        name: '',
                                        position: ''
                                    })
                                }
                            }/>
                            {edit ? <h5>Update Administrators</h5> : <h5>New Administrators</h5>}
                            <hr style={{margin:5}}/>
                        </div>
                        <FormGroup controlId="formFileSm" className="mb-3">
                            <FormLabel>Photo 2x2 (optional)</FormLabel>
                            <FormControl type="file" accept="image/*" onChange={convert_image} size="sm" />
                        </FormGroup>
                        <Form>
                            <Row>
                                <Col xs={6}>
                                    <TextField
                                        text ="Name"
                                        name="name"
                                    />
                                </Col>
                                <Col xs={6}>
                                    <TextAreaS
                                        text="Position (separate with comma)"
                                        name="position"
                                    />
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
                title={`Adminstrator of Yearbook (${props.match.params.ay})`}
                data={admins && admins}
                columns={admins && columns}
                options={options}
            />
        </div>
    )
}

export default Administrators
