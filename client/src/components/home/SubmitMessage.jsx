import React, { useState, useEffect } from 'react'
import Header from './Header';
import Footer from './Footer';
import { Container, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { newMessage } from '../../actions/home';

const SubmitMessage = () => {
    const dispatch = useDispatch()

    const [form, setForm] = useState({
        student_number: '',
        name: '',
        email: '',
        issue: '',
        message: ''
    })
    const [submitted, setSubmit] = useState(false)

    useEffect(() => {
        if(submitted){
            alert("Your issue has been submitted, we will reply to the email given after we review it.")
            setSubmit(false)
        }
    }, [submitted])

    const submit = (e) => {
        e.preventDefault()

        dispatch(newMessage(form))

        setForm({
            student_number: '',
            name: '',
            email: '',
            issue: '',
            message: ''
        })

        setSubmit(true)
    }

    return (
        <div>
            <Header/>

                <Container>
                    <div className='help__container-form'>
                        <h2>Please Fill up Forms</h2>
                        <Form onSubmit={submit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Student Number</Form.Label>
                                <Form.Control type="text" value={form.student_number} onChange={(e) => setForm({...form, student_number: e.target.value})} placeholder="Enter student number" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Enter email" required={true}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Enter email" required={true}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Your issue</Form.Label>
                                <Form.Control type="text" value={form.issue} onChange={(e) => setForm({...form, issue: e.target.value})} placeholder="" required={true}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Elaborate the situation</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder=""
                                    style={{ height: '100px' }}
                                    required={true}
                                    value={form.message}
                                    onChange={(e) => setForm({...form, message: e.target.value})} 
                                    />
                                </Form.Group>
                            <Button variant="success" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Container>
            
            <Footer/>
        </div>
    )
}

export default SubmitMessage
