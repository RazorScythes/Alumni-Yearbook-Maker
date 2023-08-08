import React, { useState, useEffect} from 'react'
import { Navbar, Container, Collapse, Carousel, Fade, Card, NavDropdown, Nav, Image, FormControl, Button } from 'react-bootstrap'
import Slide from 'react-reveal/Slide';
import LightSpeed from 'react-reveal/LightSpeed';
import HomeGrid from '../grid-image/HomeGridImage';

import Header from './Header'
import Footer from './Footer'
import ImageGallery from 'react-image-gallery';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeContent } from '../../actions/home';
import { useHistory } from 'react-router';
import LazyImage from 'react-lazy-blur-image';

import './styles.css'
import './styles.scss'

import template from '../../images/1.png'
import nametag from '../../images/nametag.png'

const LongText = ({ content, limit, showdot = true }) => {
    const [showAll, setShowAll] = useState(false);
  
    const showMore = () => setShowAll(true);
    const showLess = () => setShowAll(false);
  
    if (content.length <= limit) {
      // there is nothing more to show
      return <div>{showdot ? content : '"' + content + '"'}</div>
    }
    if (showAll) {
      // We show the extended text and a link to reduce it
      return <div> 
        {content} 
        <button onClick={showLess}>Read less</button> 
      </div>
    }
    // In the final case, we show a text with ellipsis and a `Read more` button 
    const toShow = showdot ?  content.substring(0, limit) + (showdot ? "..." : '') : '"'+content.substring(0, limit)+'"';
    return <div> 
      {toShow} 
      {/* <button onClick={showMore}>Read more</button> */}
    </div>
}

const Academic_Year = props => {
    const history = useHistory()
    const dispatch = useDispatch()

    const home_content = useSelector((state) => state.home.data)

    useEffect(() => {
        document.title = "Academic Year"
        dispatch(getHomeContent({academic_year: props.match.params.year}))
    }, [])


    const sub_content = (data) => data.map((item) => {
        return (
            <div className="home__administrator_people">
                <div className="home__administrator_img">
                    <img src={item.image} />
                </div>
                
                <label>{item.name}</label>
                <span>{item.position}</span>
            </div>
        )
    })

    const admin_container = home_content !== undefined ? home_content.administrators.list.map((item) => {
        return (
            <Carousel.Item>
                {
                    sub_content(item)
                }
            </Carousel.Item>
        )
    }) : null

    const event_container = home_content !== undefined ? home_content.events.map((item) => {
        return (
            <div className="home__events_container">
                <img src={item.image}/>
                <div className="home__events_content">
                    <h5>{item.header}
                        {/* <span>{item.createdAt.split("T")[0]}</span> */}
                    </h5>
                    <p> <LongText content = {item.content} limit = {220} /> </p>
                    <a href={`/event/${item._id}`}>Read more <i style={{verticalAlign:"middle"}} className="bx bx-right-arrow-alt"></i></a>
                </div>                  
            </div>
        )
    }) : null

    const alumni_content = (candidates) => candidates.map((item) => {
        return (
            <a href={`/alumni/${item.student_number}`} class="alumni__display" style={{ textDecoration: 'none' }}>
                <LazyImage
                    placeholder={item.main}
                    uri={item.main}
                    render={(src, style) => <img src={item.main} class="main__image"/>}
                />
                {/* <img src={item.main} class="main__image"/> */}
                <div class="nametag__container" style={{color: home_content.nametag_props.color}}>
                    <img src={item.nametag} class="nametag"/>
                    <label style={{bottom: home_content.nametag_props.name}}>{item.name}</label>
                    <span style={{bottom: home_content.nametag_props.quotes}}>{home_content.nametag_props.checked ? item.quotes ? <LongText showdot={false} content = {`${item.quotes}`} limit = {36} /> : '' : null}</span>
                </div>
            </a>
        )
    })

    const alumni_container = home_content !== undefined ? home_content.alumni.map((item) => {
        return (
            item.candidates.length > 0 ?
            <Carousel.Item>
                <div class="alumni___container">
                    <div className="home__alumni_carousel_header">
                        {item.program}
                    </div>
                    {alumni_content(item.candidates)}
                </div>
            </Carousel.Item> : null
        )
    }) : null

    return (
        <div>
            <Header/>

            { 
                home_content ? 
                <>
                <Slide left>
                    <Container style={{display:"inline", width:"100%", height:"30vh", margin:"auto", textAlign:"center", paddingTop:50}}>
                        <h1 style={{color:"#DAA520"}}>Congratulations</h1>
                        <h2>Batch of {home_content.academic_year}</h2>
                        <p style={{color:"gray", fontSize:13, padding:5, textShadow:"1px 1px 1px #c0c0c0"}}>It must be a very proud moment for you. All of the hard work you have put in has paid off. Congratulations Grad. Your reward lies ahead. Have a successful future!</p>
                        <hr style={{width:"100%", padding:0, margin:"20px 0"}}/>
                    </Container>
                </Slide>



                {
                    home_content.commence ?
                    <Slide right>
                    <Container className="home__blog-card">
                        <div className="home__meta">
                            <div className="home__photo" style={{backgroundImage: `url(${home_content.commence.image})`}}></div>
                        </div>
                        <div className="home__description">
                            <h1>{home_content.commence.name}</h1>
                            <h2>{home_content.commence.position}</h2>
                            <div className="home__text">
                                <span className="home__quotes">"{home_content.commence.quotes}"</span>             
                                <p className="home__content"> <LongText content = {home_content.commence.message} limit = {500} /> </p>      
                            </div>
                            <a href={`/commence/${home_content.commence._id}`} className="home__readmore">
                                Read More <i style={{verticalAlign:"middle"}} className="bx bx-right-arrow-alt"></i>
                            </a>
                        </div>
                    </Container>
                    </Slide> : null
                }



                {
                    home_content.administrators.list.length > 0 ?
                    <Slide bottom>
                    <section className="home__administrator">
                        <div className="home__administrator_container">
                            <div className="home__administrator_header">
                                <div class="separator">{home_content.administrators.administration}</div>
                            </div>
                            <Carousel indicators={false} interval={null} className="home__administrator_grid">
                                {admin_container}
                            </Carousel>
                        </div>
                    </section>
                    </Slide> : null
                }   


               
                {
                    event_container.length > 0 &&
                    <>
                        <h3 className="hr__separator gray">EVENTS</h3>
                        <Slide left>
                        <section className="home__events">
                            {event_container}
                            {
                                home_content.commence !== null &&
                                    event_container.length === 4 &&
                                    <div>
                                        <button className="home__see_all">See All <i className="bx bx-right-arrow-alt"></i></button>
                                    </div>
                            }
                        </section>
                        </Slide>
                    </>
                }





                {
                    home_content.alumni.length > 0 &&
                    <>
                    {/* <Slide bottom> */}
                    <section className="home__alumni">
                        <div className="home__alumni_container">
                            <div className="home__alumni_header">
                                <div class="separator">ALUMNI</div>
                            </div>
                            
                            <Carousel  className="carousel-control-prev-icon x" interval={null} className="home__alumni_grid">
                                {alumni_container}
                            </Carousel>
                        </div>
                    </section>
                    {/* </Slide> */}
                    </>
                }




                {
                    home_content.gallery !== undefined && home_content.gallery.length > 0 ?
                        <>
                            <h3 className="hr__separator gray">EXERCISE GALLERY</h3>
                            <section className="home__gallery">
                                <ImageGallery 
                                    items={home_content.gallery} 
                                    thumbnailClass ={{
                                        border: "1px solid red"}}
                                />
                                {/* <HomeGrid gallery={home_content.gallery}/> */}
                            </section>
                        </>
                    : null
                }


                <Footer/>   
                </>: null 
            }
        </div>
    )
}

export default Academic_Year
