import React, { useState, useEffect} from 'react'
import { Navbar, Container, Collapse, Carousel, Fade, Card, NavDropdown, Nav, Image, FormControl, Button, Row, Col } from 'react-bootstrap'
import Slide from 'react-reveal/Slide';
import LightSpeed from 'react-reveal/LightSpeed';
import HomeGrid from '../grid-image/HomeGridImage';
import Header from './Header';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getHomeContent } from '../../actions/home';
import ImageGallery from 'react-image-gallery';
import LazyImage from 'react-lazy-blur-image';

import './styles.css'
import './styles.scss'
import logo from '../../images/logo/logo.png'
import template from '../../images/mccbackground.png'
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


const Home = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const home_content = useSelector((state) => state.home.data)

    useEffect(() => {
        document.title = "Home"
        dispatch(getHomeContent())
    }, [])

    const sub_content = (data) => data.map((item) => {
        return (
            <div className="home__administrator_people">
                <div className="home__administrator_img">
                    <img src={item.image} />
                </div>
                
                <label>{item.name}</label>
                <span>{item.position.join(" / ")}</span>
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
                    <a href={`/event/${item.header.replace(/ /g,"-")}_${item.academic_year.academic_year}`} >Read more <i style={{verticalAlign:"middle"}} className="bx bx-right-arrow-alt"></i></a>
                </div>                  
            </div>
        )
    }) : null

    const sub_news = home_content !== undefined ? home_content.news.sub.map((item) => {
        return (
            <div onClick={() => window.location.href=`/news/${item.header.replace(/ /g,"-")}_${item.academic_year.academic_year}`} className='home__news-2-container'>
                <img src={item.image}/>
                <h3><LongText content = {item.header} limit = {51}/></h3>
                <h5><i className="bx bx-calendar" style={{fontSize:18, verticalAlign:"middle"}}></i> {item.createdAt.split("T")[0]}</h5>
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
            item.alumni.length > 0 ?
            <Carousel.Item>
                <div class="alumni___container">
                    <div className="home__alumni_carousel_header">
                        {item.program}
                    </div>
                    {alumni_content(item.alumni)}
                </div>
            </Carousel.Item> : null
        )
    }) : null

    return (
        <div className="home__page">
            {/* 
                NAVBAR
            */}
           
            <Header/>
          


                {/* 
                    CAROUSEL
                */}
                <Carousel nextIcon="" prevIcon="" variant="dark" style={{width:"100%", margin:0}}>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={template}
                            alt="First slide"
                            style={{objectFit:"cover", maxHeight:"90vh"}}
                        />
                        {/* <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                    {/* <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={template}
                            alt="First slide"
                            style={{objectFit:"cover", maxHeight:"90vh"}}
                        />

                        <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={template}
                            alt="First slide"
                            style={{objectFit:"cover", maxHeight:"90vh"}}
                        />

                        <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                    </Carousel.Item> */}
                </Carousel>



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
                    <Container className="home__blog-card" style={{paddingBottom: 20}}>
                        <div className="home__meta">
                            <div className="home__photo" style={{backgroundImage: `url(${home_content.commence.image})`}}></div>
                        </div>
                        <div className="home__description">
                            <h1>{home_content.commence.name}</h1>
                            <h2>{home_content.commence.position.position}</h2>
                            <div className="home__text">
                                <span className="home__quotes">{home_content.commence.quotes ? `"${home_content.commence.quotes}"` : null}</span>             
                                <p className="home__content"> <LongText content = {home_content.commence.message} limit = {500} /> </p>      
                            </div>
                            <a href={`/commence/${home_content.commence.name.replace(/ /g,"-")}_${home_content.academic_year}`} className="home__readmore">
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
                                <div class="separator">{home_content.administrators.administration.title}</div>
                            </div>
                            <Carousel indicators={false} interval={null} className="home__administrator_grid">
                                {admin_container}
                            </Carousel>
                            
                        </div>
                    </section>
                    </Slide> : null
                }

                {
                    home_content.news.main.length > 0 &&
                    <Container>
                        <h3 className="hr__separator gray">NEWS & UPDATES</h3>
                        <section className='home__news'>
                            <div className='home__news-container'>
                                <div className='home__news-1'>
                                    <div onClick={() => window.location.href=`/news/${home_content.news.main[0].header.replace(/ /g,"-")}_${home_content.news.main[0].academic_year.academic_year}`}>
                                        <img src={home_content.news.main[0].image}/>
                                        <h3><LongText content = {home_content.news.main[0].header} limit = {71}/></h3>
                                        <h5><i className="bx bx-calendar" style={{fontSize:18, verticalAlign:"middle"}}></i> {home_content.news.main[0].createdAt.split("T")[0]}</h5>
                                    </div>
                                </div>
                                {
                                    home_content.news.sub.length > 0 &&
                                    <div className='home__news-2'>
                                        {sub_news}
                                    </div>
                                }
                            </div>
                        </section>
                    </Container>
                }
               

               
                {
                    home_content.events.length > 0 &&
                    <Container>
                        <h3 className="hr__separator gray">EVENTS</h3>
                        <Slide left>
                        <section className="home__events">
                            {event_container}
                            {
                                home_content.commence !== null &&
                                    event_container.length === 4 &&
                                    <div>
                                        <a href="/events" className="home__see_all">See All <i className="bx bx-right-arrow-alt"></i></a>
                                    </div>
                            }
                        </section>
                        </Slide>
                    </Container>
                }



                {/* {
                    home_content.alumni.length > 0 &&
                    <>
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
                    </>
                } */}



                {
                    home_content.gallery !== undefined && home_content.gallery.length > 0 ?
                        <Container>
                            <h3 className="hr__separator gray">EXERCISE GALLERY</h3>

                            <section className="home__gallery">
                            <ImageGallery 
                                items={home_content.gallery} 
                                thumbnailClass ={{
                                    border: "1px solid red"}}
                            />
                            {/* <HomeGrid gallery={home_content.gallery}/> */}
                            </section>
                        </Container>
                    : null
                }         
 
                </>: null 
            }
            <Footer/>  
        </div>
    )
}

export default Home


