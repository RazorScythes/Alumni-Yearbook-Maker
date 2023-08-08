import React, { useState } from 'react'
import Header from './Header';
import Footer from './Footer';
import { Container } from 'react-bootstrap';
const Help = () => {

    const [button, setButton] = useState({
        b1: false,
        b2: false,
        b3: false,
        b4: false,
    })

    return (
        <div>
            <Header/>
                <Container>
                    <div className='help__container'>
                        <h2>Hi, How we can help?</h2>
                        <p>If you have concern about our websites or account, please submit a message here</p>
                        <button onClick={() => window.location.href = "/help/submit"}>Leave a Message</button>
                    </div>

                    <div className='horizontal'></div>
                    
                    <div className='help__questions'>
                        <ul style={{listStyle: "none"}}>
                            <li>
                                <div onClick={() => setButton({...button, b1: !button.b1})}><h5>How can i see my batch year? </h5> <i className={`bx ${button.b1 ? "bx-chevron-up" : "bx-chevron-down"}`} style={{fontSize:25, verticalAlign:"middle"}}></i></div>
                                {button.b1 && <p> - You need to login first by clicking the Login button next to the Help. After you signed in you can now see three more button and by clicking the "Batch Year" you can now view your batch year. </p>}
                            </li>
                            <li>
                                <div onClick={() => setButton({...button, b2: !button.b2})}><h5>Is it posible to view the other batch graduates? </h5> <i className={`bx ${button.b2 ? "bx-chevron-up" : "bx-chevron-down"}`} style={{fontSize:25, verticalAlign:"middle"}}></i></div>
                                {button.b2 && <p> - No sorry, the school will not allowed to viewed other batch year. </p>}
                            </li>
                            <li>
                                <div onClick={() => setButton({...button, b3: !button.b3})}><h5>Is it posible to download my yearbook?</h5> <i className={`bx ${button.b3 ? "bx-chevron-up" : "bx-chevron-down"}`} style={{fontSize:25, verticalAlign:"middle"}}></i></div>
                                {button.b3 && <p> - Maybe, The administrator is incharge in yearbook if they want to allow for the downloadable of yearbook or not. If they want to allow the downloadable yearbook you can see it at Account -{'>'} Download</p>}
                            </li>
                            <li>
                                <div onClick={() => setButton({...button, b4: !button.b4})}><h5>I cannot access my account</h5> <i className={`bx ${button.b4 ? "bx-chevron-up" : "bx-chevron-down"}`} style={{fontSize:25, verticalAlign:"middle"}}></i></div>
                                {button.b4 && <p> - Please leave a message by clicking the button above, Fill the forms and we'll reply as soon as posible</p>}
                            </li>
                        </ul>
                    </div>
                </Container>
            <Footer/>
        </div>
    )
}

export default Help
