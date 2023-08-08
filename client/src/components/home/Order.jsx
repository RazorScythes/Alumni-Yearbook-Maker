import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux';
import { getOrderData, preOrder, cancelOrder } from '../../actions/home';
import { Alert, Spinner, Container } from 'react-bootstrap'

import QRCode from 'qrcode.react'
import { useHistory } from 'react-router';

import Done from "@material-ui/icons/Done";
import Tooltip from "@material-ui/core/Tooltip";
const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "mcc-qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

const Order = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const home_order = useSelector((state) => state.home.order)
    const error_message = useSelector((state) => state.home.message)

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        document.title = "Request"
    }, [])
    
    useEffect(() => {
        if(!user) history.push('/')
        else dispatch(getOrderData({data: user.result}))
    }, [user, dispatch])

    const pre_order = () => {
        dispatch(preOrder({
            yearbook: home_order ? home_order.yearbook.academic_year : '',
            data: user.result
        }))
    }

    const cancel_order = (id) => {
        dispatch(cancelOrder({
            id: id,
            yearbook: home_order ? home_order.yearbook.academic_year : '',
            data: user.result
        }))
    }

    return (
        <div>
            <Header/>
            {
                home_order ? 
                <div style={{height:"70vh"}}>
                    {
                        home_order.order_status !== undefined && home_order.order_status.length < 1 ?
                            <section className="order__wrap">
                                <img src={home_order.yearbook.cover_id.image} />
                                <label>Yearbook {home_order.yearbook.academic_year}</label>
                                <p style={{color: "#FF8C00"}}>Price: <span>{home_order.yearbook.price ? home_order.yearbook.price : 'Paid'}</span></p>
                                <p className="order__desc">This serve as the accomplishment of all student who graduated in academic year {home_order.yearbook.academic_year} in Mabalacat City College</p>
                                <button onClick={pre_order} className="order__btn true">Request</button>
                            </section> 
                            : null
                    }
                    {
                        home_order.order_status.length > 0 &&
                            home_order.order_status[0].status === 'pending' ? 
                            <>
                                <Container>
                                <Alert variant="warning" style={{margin: 5}}>
                                    <Alert.Heading>Request on Queued</Alert.Heading>
                                    <p>
                                        Hi, We will send you a message via gmail when your yearbook is ready. 
                                        <br/> <b>This will take 2 - 3 days</b> 
                                    </p>
                                </Alert>
                                </Container>
                                <section className="order__wrap">
                                    <img src={home_order.yearbook.cover_id.image} />
                                    <label>Yearbook {home_order.yearbook.academic_year}</label>
                                    <p style={{color: "#FF8C00"}}>Price: <span>{home_order.yearbook.price ? home_order.yearbook.price : 'Paid'}</span></p>
                                    <p className="order__desc">This serve as the accomplishment of all student who graduated in academic year {home_order.yearbook.academic_year} in Mabalacat City College</p>
                                    <button onClick={() => cancel_order(home_order.order_status[0]._id)} className="order__btn cancel">Cancel Request</button>
                                </section> 
                            </>    : null
                    }
                    {
                        home_order.order_status.length > 0 &&
                            home_order.order_status[0].status === 'releasing' ? 
                                <section className="order__alert">
                                    <Alert variant="success" style={{margin: 5}}>
                                        <Alert.Heading>Ready to Claim</Alert.Heading>
                                        <p> 
                                            You can now claim your yearbook at Mabalacat City College. Pleace proceed to the registrar and show the qr code given.
                                        </p>
                                    </Alert>
                                    <div className="order__qr-code">
                                        <QRCode 
                                            id="qr-code" 
                                            value={`${home_order.order_status[0].alumni_id.student_number}, ${home_order.order_status[0].alumni_id.full_name.first_name} ${home_order.order_status[0].alumni_id.full_name.last_name}`}
                                            size={290}
                                            level={"H"}
                                            includeMargin={true}
                                            onClick={downloadQR}
                                        />
                                        <a onClick={downloadQR}> Scan or Download QR Code</a>
                                    </div>
                                </section> : null
                    }
                    {
                        home_order.order_status.length > 0 &&
                            home_order.order_status[0].status === 'ok' ? 
                                <>         
                                <Container>              
                                    <section className="order__alert">
                                        <Alert variant="success">            
                                            YEARBOOK Claimed, have a wonderful future!
                                        </Alert>    
                                    </section> 
                                </Container>      
                                <section className="order__wrap">
                                    <img src={home_order.yearbook.cover_id.image} />
                                    <label>Yearbook {home_order.yearbook.academic_year}</label>
                                    <p style={{color: "#FF8C00"}}>Price: <span>{home_order.yearbook.price ? home_order.yearbook.price : 'Paid'}</span></p>
                                    <p className="order__desc">This serve as the accomplishment of all student who graduated in academic year {home_order.yearbook.academic_year} in Mabalacat City College</p>
                                    <Tooltip title="Claimed">
                                        <Done color="primary" style={{fontSize:30}} />
                                    </Tooltip>
                                </section> 
                                </>
                                : null
                    }
                </div> : 

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
            <Footer/>
        </div>
    )
}

export default Order
