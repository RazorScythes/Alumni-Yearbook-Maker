import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Slide from 'react-reveal/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { getNew } from '../../actions/home';
import { Spinner, Row, Col, Card, Button, Container } from 'react-bootstrap';
import template from '../../images/1.png'
const News = props => {

    const home_news = useSelector((state) => state.home.news)
    const error_message = useSelector((state) => state.home.message)

    const dispatch = useDispatch()
    
    useEffect(() => {
        document.title = "News"
        dispatch(getNew({id: props.match.params.post}))
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

    return (
        <div>
            <Header/>
            <Button style={{margin: 10}} onClick={() => window.location.href="/"} variant="outline-primary">Go Back</Button>{' '}
            {
                home_news ?
                <>         
                    <main className="event__wrap">
                        <section className="event__container">
                        <img src={home_news.news.image}/>
                            <div className="event__title">
                                <h1>{home_news.news.header}</h1>
                                <label>Posted: {home_news.news.createdAt.split("T")[0]}</label>
                            </div>
                            <p>
                                {home_news.news.content}
                            </p>
                        </section>
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

export default News
