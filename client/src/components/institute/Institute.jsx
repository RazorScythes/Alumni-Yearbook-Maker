import React, { useState, useEffect } from 'react'
import { Card, Button, Container, Modal, Row, Col, Form, ListGroup, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getInstitute, deleteInstitute } from '../../actions/institute'
import { institute_list } from '../../assets/JsonData/institute'
import Institute_Form from './Institute_Form'
import './styles.css'
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from "@material-ui/core/Tooltip";

import default_background from '../../images/template2.jpg'

const Institute = () => {
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    const institute = useSelector((state) => state.institute)
    const inst = useSelector((state) => state.institute.inst)
    const dispatch = useDispatch()

    const [status, setStatus] = useState('')
    const [modal, setModal] = useState({
        new: false,
        delete: false
    })
    
    useEffect(() => {
        dispatch(getInstitute())
    }, [dispatch])

    useEffect(() => {
        if(institute.message){
            alertState(institute.message, institute.variant, institute.heading)
            institute.message = '' //prevent infinite render
            institute.variant = '' //prevent infinite render
            institute.heading = '' //prevent infinite render
        }
    }, [institute.message, institute])

    const [alert, setAlert] = useState({
        message: '',
        box: false,
        variant: '',
        heading: ''
    });

    const alertState = (m, v, h) => {
        setAlert({...alert, message: m, variant: v, heading: h, box: true})
    }
    
    const alertBox = () => {
        return (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, box: false})} style={{padding:15}} dismissible>
                { alert.heading ? <Alert.Heading>{alert.heading}</Alert.Heading> : null }
                { alert.message }
            </Alert>
        );
    }   

    const [edit, setEdit] = useState(null)
    const [delete_, setDelete] = useState(null)

    const DeleteModal = ({data, setModal}) => {
        const [show, setShow] = useState(true);

        const handleClose = () => {
            setModal({modal: false, delete_: null})
            setShow(false)
        }

        const deleteInst = () => {
            dispatch(deleteInstitute({id: data._id}))
            setModal({modal: false, delete_: null})
            setShow(false)
        }

        return (
            <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Deleting institute <span style={{color: "red", fontWeight:500}}>{data.institute}</span></p>
                    <p>Are you sure you want to delete this?</p>
                    <p style={{color: "#006400"}}>
                        - Related data will be kept but they will not be accessible anywhere until you created this institute again.

                    </p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={deleteInst}>Confirm</Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }

    const cards = inst !== undefined ? inst.map((item, index) => {
        return (
            <Card key={index} style={{ width: '17rem', border:"1px solid darkgray", textAlign:"center", marginRight:20, marginTop:10, backgroundImage: `url(${item.background ? item.background : default_background})`, backgroundSize:"cover"}} className="cardContainer">
                <Card.Header style={{ color:"#000", textAlign:"center", fontWeight:600, background:"#fff", border:"none", fontSize:16 }}>{item.institute}</Card.Header>
                <Card.Img variant="top" src={item.logo} style={{margin:"5px auto", background: "#FFF" , height:"200px", width: "75%", objectFit:"contain" }}/>
                <Card.Body>               
                        {
                            status == 'Edit' ?
                                <Button variant="warning" id={index} onClick={(e) => {
                                        setEdit(e.currentTarget.id)
                                        setModal({...modal, new: true})
                                    }
                                } style={{width:"100%", fontWeight: 500}} >Edit Institute</Button>
                                :
                            status == 'Delete' ?
                                <Button variant="danger" id={index} onClick={(e) => {
                                        setDelete(e.currentTarget.id)
                                        setModal({...modal, delete: true})
                                    }
                                } style={{width:"100%"}} >Delete Institute</Button>
                                :
                                <Link to={`/admin/institute/${item.institute_acronym.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                                    <Button variant="success" style={{width:"100%"}} >View Records</Button>
                                </Link>
                        }         
                </Card.Body>
            </Card>     
        )
    }) : null
    
    const handleModal = (e) => {
        setModal({...modal, new: e.modal})
        setEdit(e.edit)
    }
    
    const handleModalDel = (e) => {
        setModal({...modal, delete: e.modal})
        setDelete(e.delete_)
    }
    return (
        <>
        {
            modal.new ? 
                <Institute_Form
                    setModal={handleModal}
                    edit={edit ? inst[edit] : null}
                />
            : null
        }
        {
            modal.delete ? 
                <DeleteModal
                    setModal={handleModalDel}
                    data={delete_ ? inst[delete_] : null}
                />
            : null
        }
        
        {
            user?.result.role !== restricted_roles &&
            <>
                <Container> 
                    <Button onClick={() => setStatus('Delete')} style={{float: "right"}} variant="danger"><Tooltip title={"Delete Institute"}><DeleteIcon/></Tooltip></Button>{' '}     
                    <Button onClick={() => setStatus('Edit')} style={{float: "right", marginRight: 5}} variant="warning"><Tooltip title={"Edit Institute"}><EditIcon/></Tooltip></Button>{' '}  
                    <Button onClick={() => setStatus('')} style={{float: "right", marginRight: 5}} variant="success"><Tooltip title={"View Institute"}><VisibilityIcon/></Tooltip></Button>{' '} 
                    <Button onClick={() => setModal({...modal, new: true})} style={{float: "right", marginRight: 5}} variant="primary"><Tooltip title={"New Institute"}><AddIcon/></Tooltip></Button>{' '} 
                </Container>
                <hr className="hr" style={{visibility:"hidden", margin:0, padding: 0}}/>
            </>
        }
        
        <Container> 
            {alert.box ? alertBox() : null}
        </Container>
        <div className="wrapCard">
            {cards}
        </div>
        </>
    )
}

export default Institute
