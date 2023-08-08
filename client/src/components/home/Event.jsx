import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Slide from 'react-reveal/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { getEvent } from '../../actions/home';
import { Spinner, Row, Col, Card } from 'react-bootstrap';
import template from '../../images/1.png'
const Event = props => {

    const home_event = useSelector((state) => state.home.event)
    const error_message = useSelector((state) => state.home.message)

    const dispatch = useDispatch()
    
    useEffect(() => {
        document.title = "Event"
        dispatch(getEvent({id: props.match.params.post}))
    }, [dispatch])

    const LongText = ({ content, limit}) => {
        const [showAll, setShowAll] = useState(false);
      
        const showMore = () => setShowAll(true);
        const showLess = () => setShowAll(false);
      
        if (content.length <= limit) {
          // there is nothing more to show
          return <div>{content}</div>
        }
        if (showAll) {
          // We show the extended text and a link to reduce it
          return <div> 
            {content} 
            <button onClick={showLess}>Read less</button> 
          </div>
        }
        // In the final case, we show a text with ellipsis and a `Read more` button
        const toShow = content.substring(0, limit) + "...";
        return <div> 
          {toShow} 
          {/* <button onClick={showMore}>Read more</button> */}
        </div>
    }

    const related_event = home_event !== undefined ? home_event.related.map((item) => {
        return (
            // <a href={`/event/${item._id}`} className="related__event_box" style={{textDecoration:"none"}}>
            //     <img src={item.image}/>
            //     <p>{item.header}</p>
            // </a>
            <Slide up>
                <Card style={{ width: '18rem' }} className="r__cards">
                    <Card.Img style={{maxheight: "100px", height: "100%"}} variant="top" src={item.image} />
                    <Card.Body>
                    <Card.Title>{item.header}</Card.Title>
                    <Card.Text style={{fontSize: 13}}>
                        Posted: {item.createdAt.split("T")[0]}
                    </Card.Text>
                    <Card.Text>
                        <LongText content = {item.content} limit = {150} />
                    </Card.Text>
                    </Card.Body>
                    <Card.Body>
                        <Card.Link href={`/event/${item.header.replace(/ /g,"-")}_${item.academic_year.academic_year}`} className="r__readmore" >Read more <i style={{verticalAlign:"middle"}} className="bx bx-right-arrow-alt"></i></Card.Link>
                    </Card.Body>
                </Card>
            </Slide>
          
        )   
    }) : null

    return (
        <div>
            <Header/>
            {
                home_event ?
                <>         
                    <main className="event__wrap">
                        <section className="event__container">
                        <img src={home_event.event.image}/>
                            <div className="event__title">
                                <h1>{home_event.event.header}</h1>
                                <label>Posted: {home_event.event.createdAt.split("T")[0]}</label>
                            </div>
                            <p>
                                {home_event.event.content}
                            </p>
                        </section>
                        <div class="horizontal"></div>
                        {
                            home_event.related.length > 0 ? 
                            <>
                                <h3> Related Events </h3>
                                <section className="related__event">
                                    
                                        {related_event}
                                  
                                </section>
                            </> : null                          
                        }
                    </main>
                </> : 
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

export default Event
