import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Container, Spinner } from 'react-bootstrap'
import Slide from 'react-reveal/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { getCommence } from '../../actions/home';


const Commence = props => {
    const dispatch = useDispatch()

    const commence_data = useSelector((state) => state.home.commence)
    const error_message = useSelector((state) => state.home.message)

    useEffect(() => {
        document.title = "Commence"
        dispatch(getCommence({id: props.match.params.id}))
    }, [])

    return (
        <div>
            <Header/>
            
            <Container>
                {
                    commence_data ? 
                        <div class="commence___container">
                            <Slide left>
                            <img src={commence_data.image}/>
                            </Slide>
                            <div class="quotes">
                                <p>
                                    {commence_data.quotes ? `"${commence_data.quotes}"` : ""}
                                </p>
                            </div>
                            <div class="content">
                                <p> {commence_data.message} </p>
                                <div class="signature__">
                                    {commence_data.signature ? <img src={commence_data.signature}/> : null}
                                    <label>{commence_data.name}</label>
                                    <span>{commence_data.position.position}</span>
                                </div>
                            </div>
                        </div>  
                    : 
                    error_message ? 
                    <>
                        <div className="error_display-home">
                            <div className="fof">
                                <h1>{error_message.message}</h1>
                                <p>{error_message.additional ? error_message.additional : null}</p>
                            </div>
                        </div>
                    </> : 
                    <div className="error_display-home">
                        <div className="fof">
                        <h1>Fetching data <Spinner animation="border" variant="secondary" style={{verticalAlign:"middle", fontSize: 20}} /></h1>
                        </div>
                    </div>
                }
            </Container>

            <Footer/>
        </div>
    )
}

export default Commence
