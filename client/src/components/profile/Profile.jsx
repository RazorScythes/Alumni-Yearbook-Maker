import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Alert, Container, Col, Row } from 'react-bootstrap'
import { changePassword, updateName } from '../../actions/profile'

const Profile = () => {
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'))
    const profile = useSelector((state) => state.profile)
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [name, setName] = useState('')

    useEffect(() => {
        if(profile.message){
            alertState(profile.message, profile.variant, profile.heading)
            profile.message = '' //prevent infinite render
            profile.variant = '' //prevent infinite render
            profile.heading = '' //prevent infinite render
        }
    }, [profile.message, profile])

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
                <Alert.Heading>{alert.heading}</Alert.Heading>
                <p>
                    { alert.message }
                </p>
            </Alert>
        );
    }   

    const submit = (e) => {
        e.preventDefault()
        dispatch(changePassword({
            id: user?.result._id,
            old: form.oldPassword,
            new: form.newPassword,
            confirm: form.confirmPassword
        }))

        setForm({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }   

    const changeName = (e) => {
        e.preventDefault()

        dispatch(updateName({
            id: user?.result._id,
            name: name
        }))

        setName('')

    }
    return (
        <div className="wrap p-3 pt-0">
            {/* <h2>Change Password</h2>
            <hr className="hr"/> */}
            {alert.box ? alertBox() : null}
            <Container style={{height: 'auto', padding:"20px 10px"}}>
                <div style={{marginBottom: 40}}>
                    <h3>UPDATE NAME</h3><hr />
                    <Form onSubmit={changeName}>
                        <Row>
                            <Col lg="auto" style={{display:"flex"}}>
                                <label style={{marginTop:5, marginRight: 5}}>Name: </label> 
                                <Form.Control value={name} type="text" onChange={(e) => setName(e.target.value)} required={true} />{' '}
                                <Button type="submit" style={{marginLeft: 5}} variant="success">Update</Button>
                            </Col>
                            <Col></Col>
                        </Row>
                    </Form>
                </div>
                <div style={{marginBottom: 40}}>
                    <h3>CHANGE PASSWORD</h3>
                    <Form onSubmit={submit}>
                        <Row>
                            <Col sm="auto">
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Old Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setForm({...form, oldPassword: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col sm="auto">
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setForm({...form, newPassword: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col sm="auto">
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>            
                        <Button variant="success" type="submit" style={{float:"right", margin:"10px 0"}} >
                            Update Password
                        </Button>
                    </Form>
                </div>    
            </Container>
{/* 
            <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setForm({...form, oldPassword: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setForm({...form, newPassword: e.target.value})} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
                </Form.Group>
                <Button variant="primary" type="submit" style={{float:"right", margin:"10px 0"}} >
                    Change Password
                </Button>
            </Form> */}
        </div>
    )
}

export default Profile
