import React, { useState, useEffect } from 'react'
import Logo from '../../images/transparent/logo_transparent.png'
import { useDispatch, useSelector } from 'react-redux';
import { newMessage } from '../../actions/home';

const Footer = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const dispatch = useDispatch()
    

    const [form, setForm] = useState({
        email: '',
        message: ''
    })
    const [submitted, setSubmit] = useState(false)

    useEffect(() => {
        if(submitted){
            alert("Your message has been submitted, we will reply to the email given after we review it.")
            setSubmit(false)
        }
    }, [submitted])

    const submit = (e) => {
        e.preventDefault()

        dispatch(newMessage(form))

        setForm({
            email: '',
            message: ''
        })

        setSubmit(true)
    }


    return (
        <footer>
            <div className="content">
                <div className="top">
                    <div className="logo-details">
                        <img src={Logo}/> {' '}
                        <span className="logo_name">Alumni Yearbook</span>
                    </div>
                    {/* <div className="media-icons" >
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#"><i className="fab fa-youtube"></i></a>
                    </div> */}
                </div>
                <div class="link-boxes">
                    <ul className="box about-us">
                        <li className="link_name no-border header">About Us</li>
                        <li className="link_name-text">We worked together to create and design this website for the alumni yearbook of Mabalacat City College. We are concerned about the issues regardless about this and we are here to solve that problem.</li>
                    </ul>
                    <ul className="box link">
                        <li className="link_name">Links</li>
                        <li><a href="/">Home</a></li>
                        <li><a href="/events">Events</a></li>
                        {!user? <li><a href="/login">Login</a></li> : null}
                        {
                            user?.result.role === 'Student' &&
                            <>
                                <li><a href="#">Batch Year</a></li>
                                <li><a href="#">Gallery</a></li>
                            </>
                        }
                    </ul>

                    {
                        user?.result.role === 'Student' ? 
                            <ul className="box link">
                                <li className="link_name">Account</li>
                                <li><a href="/order">Request Yearbook</a></li>
                                <li><a href="/yearbook">Download</a></li>
                                <li><a href={`/alumni/${user.result.student_number ? user.result.student_number : user.result.alumni_id}`}>Profile</a></li>
                                <li><a href="/change_password">Change Password</a></li>
                            </ul> : null

                    }
                    <ul className="box input-box">
                        <li className="link_name no-border">Need Concern / Suggestions?</li>
                        <form onSubmit={submit}>
                            <li><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Enter your email" required/></li>
                            <li><input type="text" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="Your concern / suggestions" required/></li>
                            <li><input type="submit" value="Send"/></li>
                        </form>
                    </ul>
                </div>
            </div>
            <div className="bottom-details">
            <div className="bottom_text">
                <span className="copyright_text">© Copyright 2021 All rights reserved<br/> Developed by: <a href="#" style={{color:"yellow"}}>RazorScythe</a></span>
                <span className="policy_terms">
                {/* <a href="#">Privacy policy</a>
                <a href="#">Terms & condition</a> */}
                </span>
            </div>
            </div>
        </footer>
        // <section className="home__footer">
            
        // </section>    
    )
}

export default Footer
