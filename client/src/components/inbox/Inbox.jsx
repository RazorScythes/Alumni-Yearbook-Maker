import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Toast, Form, FloatingLabel, Button, Alert } from 'react-bootstrap';
import moment from 'moment'
import { getAllMessage, updateAllMessage, replyMessage, removeMessage } from '../../actions/inbox';
import { Tooltip } from '@material-ui/core';
const Inbox = () => {
    const dispatch = useDispatch()
    const inbox =  useSelector((state) => state.inbox)
    const message_list = useSelector((state) => state.inbox.message_list)

    useEffect(() => {
        if(inbox.message){
            alertState(inbox.message, inbox.variant)
            inbox.variant = '' //prevent infinite render
            inbox.message = '' //prevent infinite render
        }

        if(inbox.response && !update) {
            inbox.response = ''

            dispatch(updateAllMessage(message_list))
            setUpdated(true)
        }
        if(!once){
            dispatch(getAllMessage())
            setOnce(true)
        }
    }, [dispatch, inbox.response, inbox.message, inbox])

    const [alert, setAlert] = useState({
        message: '',
        variant: '',
        box: false,
    });

    const [once, setOnce] = useState(false)
    const [focus, setFocus] = useState("")
    const [update, setUpdated] = useState(false)
    const [form , setForm] = useState({
        id: '',
        reply: '',
    })

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

    const show_message = message_list !== undefined ? message_list.map((item, index) => {
        return (
            <Toast style={{width: "100%", marginBottom: "5px"}}>
                <Toast.Header closeButton={false}>
                    <Tooltip title={item.status === '1_new' ? "New" : item.status === '2_read' ? "Read" : "Done"}>
                    <div style={{width:"20px", height:"20px", 
                        background: item.status === '1_new' ? "#d9534f" : item.status === '2_read' ? "#292b2c" : "#5cb85c", 
                        marginRight:"5px", borderRadius: "5px" }}></div>
                    </Tooltip>
                    <strong className="me-auto">{item.email}</strong> 
                    <small>{moment(item.createdAt).fromNow()}</small> 
                    <small onClick={() => dispatch(removeMessage({id: item._id}))}><i className="bx bx-trash" style={{margin: "0 10px", fontSize:18, cursor: "pointer"}}></i></small> 
                    { 
                        !item.reply && 
                            <small onClick={() => {
                                setFocus(item._id)
                                setForm({...form, id: item._id})
                                }} style={{cursor: "pointer"}}>Reply</small>
                    }
                </Toast.Header> 
                <Toast.Body>
                    {item.issue && <p style={{fontWeight:600, margin: 0, fontSize:18}}>{item.issue && item.issue}</p>}
                    {item.name && <p style={{fontWeight:500, color: "gray", fontSize:13}}>{item.name && item.name} {item.student_number && `(${item.student_number})`}</p>}
                    - {item.message}
                </Toast.Body>
                {
                    focus === item._id &&
                    <>
                        <div style={{height: 5, borderTop: "1px solid gray", borderBottom: "2px solid gray"}}></div>
                        <Toast.Body>
                            <FloatingLabel controlId="floatingTextarea" label="Write a reply">
                                <Form.Control as="textarea" placeholder="Leave a comment here" onChange={(e) => setForm({...form, reply: e.target.value})} style={{width: "100%"}} required/>
                            </FloatingLabel>
                            <div style={{width: "100%", display: "inline-block", padding: 0}}><Button variant="success" type="submit" style={{padding: 5, fontSize: 12, marginTop: 5, float: "right"}}>Reply</Button></div>
                        </Toast.Body> 
                    </>
                } 
            </Toast>
        )
    }) : null

    const submit = (e) => {
        e.preventDefault()

        dispatch(replyMessage(form))

        setForm({
            id: '',
            reply: '',
        })

        setFocus('')
    }
    return (
        <div style={{padding:20}}>
            {alert.box && alertBox()}
            <Form onSubmit={submit}>
                {show_message}
            </Form>
        </div>
    )
}

export default Inbox
