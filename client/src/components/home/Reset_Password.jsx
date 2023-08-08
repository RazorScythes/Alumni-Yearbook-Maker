import React, { useEffect, useState } from 'react'
import { Container, Form, Row, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { checkResetConfirmation, newPassword } from '../../actions/auth';

const Reset_Password = props => {

    const dispatch = useDispatch()
    const error_message = useSelector((state) => state.auth.error)
    const reset_state = useSelector((state) => state.auth.reset_state)
    const new_password = useSelector((state) => state.auth.new_password)

    const [form, setForm] = useState({
        new_: '',
        confirm: '',
        id: props.match.params.id ? props.match.params.id : ''
    })

    const [err, setErr] = useState('')
    const [submission, setSubmission] = useState(false)

    useEffect(() => {
        dispatch(checkResetConfirmation({id: props.match.params.id}))
    }, [dispatch])
    
    const submit = (e) => {
        e.preventDefault()
        if(submission) return

        if(form.new_.length < 6) return setErr("Password must be 6 or more characters")

        if(form.new_ !== form.confirm) return setErr("New and Confirm Password not Matched")
        else setErr("")

        dispatch(newPassword(form, {id: props.match.params.id} ))
        setSubmission(true)
    }

    return (
        <Container style={{marginTop:20}}>

            <h2> Reset Password </h2>

            
            {
                error_message ? 
                    error_message.message
                    :
                    new_password ? 
                        <>
                            Password Successfully changed!, you can login now by <a href="/login">clicking this</a>
                        </>
                    :
                    reset_state ? 
                    <Row>
                        <Col>
                            <Form onSubmit={submit}>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control onChange={(e) => setForm({...form, new_: e.target.value})}  type="password" placeholder="Password" required/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Re-enter Password</Form.Label>
                                    <Form.Control onChange={(e) => setForm({...form, confirm: e.target.value})} type="password" placeholder="Password" required/>
                                </Form.Group>
                                { err ? <span style={{margin:"5px", color:"red", fontWeight:500}}>{err}</span> : null }
                                <Button type="submit" style={{float: "right"}} variant="success">Confirm</Button>
                            </Form>
                        </Col>
                        <Col></Col>
                    </Row> :
                    "Loading..."
            }
            
        </Container>
    )
}

export default Reset_Password
