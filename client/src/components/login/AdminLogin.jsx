import React, { useState, useEffect } from 'react'
import './styles.css'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SignIn } from '../../actions/auth'
import { Button } from 'react-bootstrap'
import Logo from '../../images/transparent/logo_transparent.png'
const AdminLogin = ({setUser}) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)
    const user = JSON.parse(localStorage.getItem('profile'))
    const credentials = JSON.parse(localStorage.getItem('credentials'))

    const [remember, setRemember] = useState(credentials ? credentials.state : false)
    const [form, setForm] = useState({
        username: credentials ? credentials.username : '',
        password: credentials ? credentials.password : '',
    })

    useEffect(() => {
        document.title = "Admin Login"
        if(!user) return
        else
            if(remember) localStorage.setItem('credentials', JSON.stringify({ username:  form.username, password: form.password, state: true}));
            else localStorage.removeItem('credentials')

        setUser(user)
        if(user?.result.role === 'Student') history.push('/')
        else history.push('/admin')
    }, [user])

    const submit = (e) => {
        e.preventDefault()
        dispatch(SignIn(form, history))
    }

    return (
        <div className="login-form">
            <Button onClick={() => window.location = "/"} variant="primary" style={{margin: 10, backgroundColor:"#8B0000", border:"none"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}></i> Home</Button>
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
            </form>
            {/* <form className="login" onSubmit={submit}>
                <img src={Logo}/>
                <h2>Welcome Back!</h2>
                <p>Please log in</p>
                { 
                    auth.error && <span style={{margin:"5px", color:"red", fontWeight:500}}>{auth.error}</span>
                }
                <input type="text" placeholder="Username" onChange={(e) => setForm({...form, username: e.target.value})} required/>
                <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} required/>
                <input type="submit" value="Log In" />
            </form> */}
        </div>
    )
}

export default AdminLogin
