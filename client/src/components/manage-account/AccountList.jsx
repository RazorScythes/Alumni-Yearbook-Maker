import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getAccounts } from '../../actions/accounts';
import { Button, Row, Col, CloseButton, Alert, Modal, FormControl } from 'react-bootstrap';
import { Paper } from '@material-ui/core';
import AddToolbar from './CustomToolbar/AddToolbar';
import { confirmDeletion, uploadAccount, updateAccount, deleteAccount, sendGmail } from '../../actions/accounts';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Formik, Form } from 'formik';
import { NormalTextFieldXLabel, NormalTextFieldEmail, NormalTextFieldPassword } from '../batch-template/TextArea';
import * as Yup from 'yup';

import Tooltip from "@material-ui/core/Tooltip";
import './styles.css'
const AccountList = props => {
    const account_list = useSelector((state) => state.accounts.account_list)
    const accounts = useSelector((state) => state.accounts)

    const user = JSON.parse(localStorage.getItem('profile'))

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if(user?.result.role !== "Admin") history.push('/admin')

        if(!(props.match.params.role === "Admin" || props.match.params.role === "Sub Admin" || props.match.params.role === "Staff" || props.match.params.role === "Student"))
            history.push('/admin/account-manage')

        dispatch(getAccounts({role: props.match.params.role}))
    }, [])

    useEffect(() => {
        if(accounts.message){
            alertState(accounts.message)
            accounts.message = '' //prevent infinite render

            setEdit(false);
            setUploadShow(false);
        }
    }, [accounts.message, accounts])

    const [alert, setAlert] = useState({
        message: '',
        box: false,
    });

    
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

    const [initialForm, setInitialForm] = useState({
        id: '',
        name: '',
        username: '',
        email: '',
        password: '',
    })

    const [uploadShow, setUploadShow] = useState(0)
    const [edit, setEdit] = useState(0)
    const [deleteId, setDeleteId] = useState(0)

    const DeleteModals = props => {
        const currentUser = useSelector((state) => props.id ? state.accounts.account_list.find((p) => p._id === props.id) : null)
        const [show, setShow] = useState(true);
        const [err, setErr] = useState('')
        const [pass, setPass] = useState('')

        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            dispatch(deleteAccount({
                role_: props.role,
                id: currentUser._id,
            }))
            props.setDeleteId(false)
        }

        const confirmAccount = () => {
            dispatch(confirmDeletion({
                role_: props.role,
                id: currentUser._id,
                password: pass
            }))
        }
        
        useEffect(() => {
            if(accounts.message) {
                props.setDeleteId(false)
                setShow(false)
            }

            if(accounts.err_message){
                setErr(accounts.err_message)
                accounts.err_message = '' //prevent infinite render
            }
        }, [accounts.err_message, accounts.message, accounts])

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete {currentUser ? currentUser.username : null}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        err ? 
                            <Alert variant="danger" style={{padding:5, paddingLeft:10}}>
                                {err}
                            </Alert>
                        : null
                    }
                    
                    {
                        props.role === "Admin" ?
                        <>
                            Enter account password to continue
                            <FormControl onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" />
                        </>
                        : 
                        <>
                            Do you want to continue?
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={props.role === "Admin" ? confirmAccount : handleDelete}>
                    Confirm
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
            dispatch(deleteAccount({
                data: props.data,
                role_: props.role,
            }))
            props.setData(null)
        }
        
        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete {props.data.length} selected {props.role.toLowerCase()}{props.data.length > 1 ? "'s" : ''}?</Modal.Body>
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
            name: "username",
            label: "Username",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "email",
            label: "Email",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "created",
            label: "Created",
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
                            { 
                                props.match.params.role !== "Admin" ?
                                <>
                                    <Tooltip title="Send Account Email">
                                        <Button variant="danger" style={{fontSize:15, marginLeft:5, visibility: tableMeta.rowData[2] !== "n/a" ? 'visible' : 'hidden'}} onClick={() => dispatch(sendGmail({id: account_list[tableMeta.rowIndex]._id, email: tableMeta.rowData[2]}))}><i className="bx bx-send"></i></Button>
                                    </Tooltip>
                                    
                                    <Tooltip title="Edit">
                                        <Button variant="warning" style={{fontSize:15, marginLeft:5}} onClick={() => {
                                            setInitialForm({ ...initialForm,
                                                id: account_list[tableMeta.rowIndex]._id,
                                                name: tableMeta.rowData[0],
                                                username: tableMeta.rowData[1],
                                                email: tableMeta.rowData[2] === "n/a" ? '' : tableMeta.rowData[2] ,
                                            })
                                            setUploadShow(1); 
                                            setEdit(1);
                                        }}><i className="bx bxs-edit"></i></Button>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <Button variant="danger" style={{fontSize:15, marginLeft:5}} onClick={() => setDeleteId(account_list[tableMeta.rowIndex]._id)}><i className="bx bx-trash"></i></Button>
                                    </Tooltip>
                                </> : 
                                <Tooltip title="Delete">
                                    <Button variant="danger" style={{fontSize:15, marginLeft:5}} onClick={() => setDeleteId(account_list[tableMeta.rowIndex]._id)}><i className="bx bx-trash"></i></Button>
                                </Tooltip>
                            }
                        </>
                    )
                }
            }
        },
    ];

    const handleToolbar = (e) => {
        setUploadShow(e)
    }

    const options = {
        selectableRows: props.match.params.role !== "Admin" ? true : 'none', 
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
                        props.match.params.role !== "Student" &&
                            <AddToolbar 
                                bool={handleToolbar}
                            />
                    }
                </>
            );
        },
        onRowsDelete:(e)=>{
            let arr = []
            e.data.forEach((item) => {
                arr.push(account_list[item.index])
            })
            setData(arr)
            console.table(arr)
        }
    };

    const handleSubmit  = (e) => {
        if(edit){
            dispatch(updateAccount({
                role_: props.match.params.role,
                id: initialForm.id,
                name: e.name,
                username: e.username,
                email: e.email,
                password: e.password
            }))

            setInitialForm({ ...initialForm,
                id: '',
                name: '',
                username: '',
                email: '',
                password: '',
            })
        }
        else{
            dispatch(uploadAccount({
                role: props.match.params.role,
                id: initialForm.id,
                name: e.name,
                username: e.username,
                email: e.email,
                password: e.password
            }))
        }
    }

    const validate = Yup.object({
        name: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
        username: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
        password: Yup.string()
          .min(5, 'Must be 5 characters or more')
    })

    return (
        <div style={{padding:20}}>
            {
                user?.result.role === "Admin" ?
                <>
                <Link to={`/admin/account-manage`} style={{ textDecoration: 'none' }}>
                    <Button variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
                </Link>
                {
                    uploadShow ?
                    <Paper elevation={2} style={{marginBottom:5, padding: 10}}>
                    <Formik
                        initialValues={{
                            name: '',
                            username: '',
                            email: '',
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
                                            username: '',
                                            email: '',
                                            password: '',
                                        })
                                    }
                                }/>
                                {edit ? <h5>Update User Account</h5> : 
                                    <>
                                        <h5>New User Account</h5>
                                        <Alert variant="primary">
                                            If the password field is blank, the password will automatically same as the username.
                                        </Alert>
                                    </>
                                }
                                
                            </div>
                            <Form>
                                <Row>
                                    <Col xs={6}>
                                        <NormalTextFieldXLabel
                                            text ="Name"
                                            name="name"
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <NormalTextFieldXLabel
                                            text ="Username"
                                            name="username"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <NormalTextFieldEmail
                                            text ="Email"
                                            name="email"
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <NormalTextFieldPassword
                                            text ="Password"
                                            name="password"
                                        />
                                    </Col>
                                </Row>                          
                                <div style={{width:"100%", display:"inline-block"}}>
                                    <button className="btn btn-dark mt-3" style={{float:"right", margin:0, marginRight:0}} type="submit">{edit ? 'Update' : 'Register'}</button>
                                </div>
                            </Form>
                            </div>
                        )}
                    </Formik>
                    </Paper> : 
                    <Alert variant="warning">
                        <Alert.Heading>Admin Authorized Only</Alert.Heading>
                        <p>
                            You can view, select and modify users account in this page.
                        </p>
                    </Alert>
                }
                {alert.box && !uploadShow ? alertBox() : null}
                {
                    deleteId ? 
                    <DeleteModals
                        setDeleteId={setDeleteId}
                        id={deleteId}
                        role={props.match.params.role}
                    /> : null
                } 
                {
                    multiData ? 
                    <MultipleDelete
                        setData={setData}
                        data={multiData}
                        role={props.match.params.role}
                    /> : null
                } 
                <MUIDataTable
                    title={`Account List (${props.match.params.role})`}
                    data={account_list && account_list}
                    columns={account_list && columns}
                    options={options}
                />
                </> : 
                <Alert variant="danger">
                    <Alert.Heading>Error 401 - Unauthorized</Alert.Heading>
                    <p>
                        You don't have permission to view this page
                    </p>
                    <hr />
                    <p className="mb-0">
                        Please contact the administrator for further concerns
                    </p>
                </Alert>
            }
        </div>
    )
}

export default AccountList
