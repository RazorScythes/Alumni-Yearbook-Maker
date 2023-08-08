import React, { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Form, Button, Alert, Container, Col, Row } from 'react-bootstrap'
import { changeAlumniPassword, changeEmail } from '../../actions/home'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router';
const Change_Password = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const home = useSelector((state) => state.home)

    useEffect(() => {
        document.title = "Change Password"
        
        if(!user) history.push('/')

        if(home.message){
            setAlert({
                ...alert,
                message: home.message ? home.message : '',
                variant: home.variant ? home.variant : '',
                box: true
            })

            home.message = ''
            home.variant = ''
        }
    }, [user, home.message])

    const AlertMessage = () => {
        return (
            <Container style={{marginTop:15}}>
                <Alert variant={alert.variant}>
                    {alert.message}
                </Alert>
            </Container>
        )
    }
    const [alert, setAlert] = useState({
        message: '',
        variant: '',
        box: false
    })

    const [form, setForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    })

    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        
        dispatch(changeAlumniPassword({
            info: user?.result,
            form: form
        }))

        setForm({
            ...form,
            old_password: '',
            new_password: '',
            confirm_password: ''
        })
    }

    const handleEmail = (e) => {
        e.preventDefault()

        dispatch(changeEmail({
            info: user?.result,
            email: email
        }))

        setEmail('')
    }

    return (
        <div>
            <Header/>

            {
                alert.box ? <AlertMessage/> : null
            }
            <Container style={{height: 'auto', padding:"20px 10px"}}>
                <div style={{marginBottom: 40}}>
                    <h3>UPDATE EMAIL ADDRESS</h3><hr />
                    <Form onSubmit={handleEmail}>
                        <Row>
                            <Col lg="auto" style={{display:"flex"}}>
                                <label style={{marginTop:5, marginRight: 5}}>Email: </label> 
                                <Form.Control value={email} type="email" onChange={(e) => setEmail(e.target.value)} required={true} />{' '}
                                <Button type="submit" style={{marginLeft: 5}} variant="success">Update</Button>
                            </Col>
                            <Col></Col>
                        </Row>
                    </Form>
                </div>
                <div style={{marginBottom: 40}}>
                    <h3>CHANGE PASSWORD</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm="auto">
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>Old Password</Form.Label>
                                    <Form.Control value={ form.old_password } onChange={(e) => setForm({...form, old_password: e.target.value})} type="password" placeholder="Password" required={true}/>
                                </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col sm="auto">
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control value={ form.new_password } onChange={(e) => setForm({...form, new_password: e.target.value})} type="password" placeholder="Password" required={true}/>
                                </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col sm="auto">
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control value={ form.confirm_password } onChange={(e) => setForm({...form, confirm_password: e.target.value})} type="password" placeholder="Password" required={true}/>
                                </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>            
                        <Button type="submit" variant="success">Update Password</Button>
                    </Form>
                </div>    
            </Container>
            {/* <div style={{height: '60vh'}}>

            <section className="home__password-container">
                <h2>Change Password</h2>
                <hr/>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control value={ form.old_password } onChange={(e) => setForm({...form, old_password: e.target.value})} type="password" placeholder="Password" required={true}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control value={ form.new_password } onChange={(e) => setForm({...form, new_password: e.target.value})} type="password" placeholder="Password" required={true}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control value={ form.confirm_password } onChange={(e) => setForm({...form, confirm_password: e.target.value})} type="password" placeholder="Password" required={true}/>
                    </Form.Group>
                    <Button type="submit" variant="outline-primary">Confirm</Button>
                </Form>
            </section>
            </div> */}
            <Footer/>
        </div>
    )
}

export default Change_Password
