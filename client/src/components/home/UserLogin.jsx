import React, { useState, useEffect } from 'react'
import './styles.css'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { SignIn, ResetPassword } from '../../actions/auth'
import Logo from '../../images/transparent/logo_transparent.png'

const UserLogin = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)
    const not_exists = useSelector((state) => state.auth.not_exists)

    const user = JSON.parse(localStorage.getItem('profile'))
    const credentials = JSON.parse(localStorage.getItem('credentials'))

    const [forgot, setForgot] = useState(false)
    const [remember, setRemember] = useState(credentials ? credentials.state : false)
    const [form, setForm] = useState({
        username: credentials ? credentials.username : '',
        password: credentials ? credentials.password : '',
    })
    
    const [email, setEmail] = useState('')
    useEffect(() => {
        document.title = "Login"
        if(!user) return
        else
            if(remember) localStorage.setItem('credentials', JSON.stringify({ username:  form.username, password: form.password, state: true}));
            else localStorage.removeItem('credentials')

        if(user?.result.role === 'Student') history.push('/')
        else history.push('/admin')

        // if(user) history.push('/')
    }, [user])

    const submit = (e) => {
        e.preventDefault()
        dispatch(SignIn(form, history))
    }

    const reset = (e) => {
        e.preventDefault()
        dispatch(ResetPassword({email: email}))
    }

    return (
        <div className="login-form">
            <Button onClick={() => window.location = "/"} variant="primary" style={{margin: 10, backgroundColor:"#8B0000", border:"none"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}></i> Home</Button>
            {
                !forgot ?
                <form className="login" onSubmit={submit}>
                    <img src={Logo}/>
                    <h2>Login</h2>
                    <p>Please log in</p>
                    { 
                        auth.error && <span style={{margin:"5px", color:"red", fontWeight:500}}>{auth.error}</span>
                    }
                    <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required/>
                    <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required/>
                    <div><input type="checkbox" checked={remember} onChange={(e) => setRemember(!remember)}/> Remember Me</div>
                    <input type="submit" value="Log In" />
                    <label onClick={() => setForgot(true)}>Forgot Password</label>
                </form>
                :
                auth.email ? 
                <form className="email_sent" onSubmit={reset}>
                    <h2>Email Sent!</h2>
                    <label>Please check your inbox to reset your password</label>
                    <span onClick={() => setForgot(false)}>Go back</span>
                </form>
                :
                <form className="forgot_password" onSubmit={reset}>
                    <h2>Forgot Password</h2>
                    <label>Please Enter your Email Address here</label>
                    <div>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email Address" required/>
                    { not_exists ? <p>Email does not exists</p> : null }
                    </div>
                    <input type="submit" value="Reset my Password"/>
                   
                    <span onClick={() => setForgot(false)}>Go back</span>
                </form>
            }
        </div>
    )
}

export default UserLogin
