import React, { useEffect, useState } from 'react'
import Header from './Header';
import Footer from './Footer';
import {  Container, Spinner, Dropdown, NavItem, NavLink, Navbar, Collapse, Carousel, Fade, Card, NavDropdown, Nav, Image, FormControl, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { getGraduates } from '../../actions/home';
import Slide from 'react-reveal/Slide';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { useHistory } from 'react-router';

import template from '../../images/1.png'
import nametag from '../../images/nametag.png'
const Graduates = () => {
    const dispatch = useDispatch()

    const graduated_student = useSelector((state) => state.home.graduates)
    const error_message = useSelector((state) => state.home.message)

    const [focus, setFocus] = useState('')
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const history = useHistory()
    useEffect(() => {
        document.title = "Graduates"
        if(!user) history.push('/')
        else dispatch(getGraduates({alumni_id: user?.result.alumni_id}))

    }, [dispatch])

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

    const alumni_content = (candidates, props) => candidates.map((item, i) => { 
        return ( 
            <a key={i} href={`/alumni/${item.searchKey.student_number ? item.searchKey.student_number : `${item.searchKey.first_name}_${item.searchKey.last_name}`}`} className="alumni__display" style={{ textDecoration: 'none' }}>
                <LazyLoadImage
                    wrapperClassName="main__image"
                    alt={item.main}
                    effect="blur"
                    src={item.main} 
                />

                {/* <img src={item.main} class="main__image"/> */}
                    <div className="nametag__container" style={{color: props.color}}>
                        <img src={item.nametag} className="nametag"/>
                        <label style={{bottom: item.quotes ? props.name : (props.name - props.name/3)}}>{item.name}</label>
                        <span style={{bottom: props.quotes}}>{props.checked ? item.quotes ? <LongText showdot={false} content = {`${item.quotes}`} limit = {36} /> : '' : null}</span>
                    </div>
            </a>
        )
    })

    const alumni_container = (candidates, props) => candidates.length > 0 ? candidates.map((item, i) => {     
        return (
            <div className="alumni___container-box">
                <div className="home__alumni_carousel_header">
                        {item.program}
                </div>
                {
                    item.alumni.length > 0 ?
                        alumni_content(item.alumni, props)
                    :   <div className="error_display-home" style={{height:"10vh"}}>
                            <div className="fof white">
                                <h3> No Data to be displayed yet in this section </h3>
                            </div>
                        </div>
                }
            </div>        
        )
    }) : 
        <div className="error_display-home" style={{height:"10vh"}}>
            <div className="fof">
                <h3> No Data to be displayed in this batch year </h3>
            </div>
        </div>

    const [filter, setFilter] = useState({
        institute: '',
        program: ''
    })


    const main_container = (data, institute_name) => data.length > 0 ? data.filter((object) => 
        Object.keys(object).some(k => object[k] !== null && (object['institute'].toString().includes(filter.institute) && object['program'].toString().includes(filter.program)))).map((item) => {
            return (
                // <Slide up>
                <>
                    {
                        item.candidates.length > 0 ?
                        <section className="home__alumni">
                            <div className="home__alumni_container">
                                <div className="home__alumni_header">
                                    <div className="separator">{institute_name}</div>
                                </div>
                                
                                <section className="home__alumni_grid">
                                    <Container style={{display:"inline", width:"100%", margin:"auto", textAlign:"center"}}>
                                        <div className="alumni___container">
                                            {alumni_container(item.candidates, item.nametag_props)}
                                        </div>
                                    </Container>
                                </section>
                            </div>
                        </section>
                        :
                        <div className="error_display-home" style={{height:"10vh"}}>
                            <div className="fof">
                                <h3> No Data to be displayed yet in this section </h3>
                            </div>
                        </div>
                    }
                </>
                // </Slide>
            ) 
        }) : null

    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    const institute_container = graduated_student !== undefined ? graduated_student.data.map((item, index) => {
        return (
            <>
                {main_container(item.data, item.institute_name)}
            </>
        )
    }) : null

    const program_selector = (program, institute) => program.length > 0 ? program.map((item, index) => {
        return (
            <NavDropdown.Item href={`#${index}`} onClick={() => {
                setFilter({...filter, institute: institute, program: item.program_acronym})
                topFunction()
            }}>{item.program_acronym}</NavDropdown.Item>
        )
    }) : null

    const get_year = graduated_student !== undefined ? graduated_student.data.map((item, index) => {
        return (
            <NavDropdown title={item.institute} id="collasible-nav-dropdown">
                <Dropdown.Item onClick={() => setFilter({...filter, institute: item.institute, program: ''})}>All</Dropdown.Item>
                {program_selector(item.program, item.institute)}
            </NavDropdown>
        )
    }) : null

    return (
        <div>
            <Header/>

                {
                    graduated_student !== undefined ?
                        <>
                            <>
                                <div style={{display:"inline", textAlign:"center"}}>
                                    <h1 style={{color:"#DAA520", margin: 20, textShadow:"1px 1px 1px gray"}}>GRADUATES OF MABALACAT CITY COLLEGE
                                        <br/>
                                        <h2>{graduated_student !== undefined ? `BATCH ${graduated_student.academic_year}` : null} </h2>
                                    </h1>
                                    
                                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                                        <Container>
                                         <Navbar.Brand href="#">INSTITUTE</Navbar.Brand>
                                         <Navbar.Toggle style={{fontSize:12}} aria-controls="responsive-navbar-nav" />
                                            <Navbar.Collapse id="responsive-navbar-nav">
                                                <Nav className="me-auto" fill  >
                                                    <Nav.Item>
                                                        <Nav.Link id="" eventKey={`link-0`} onClick={(e) => setFilter({institute: '', program: ''})}>All</Nav.Link>
                                                    </Nav.Item>
                                                    {get_year}
                                                </Nav>
                                            </Navbar.Collapse>
                                            
                                        </Container>
                                    </Navbar>
                                </div>
                            </>
                            {institute_container}
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
                {/* <Slide up> */}
                    {/* <Container style={{display:"inline", width:"100%", height:"30vh", margin:"auto", textAlign:"center", margin: 10, paddingTop:10}}> */}
                        {/* <h1 style={{color:"#DAA520"}}>GRADUATES OF MABALACAT CITY COLLEGE</h1> */}
                        {/* <hr style={{width:"100%", padding:0, margin:"10px 0"}}/> */}
                    {/* </Container> */}
                {/* </Slide> */}
                 {/* {main_container} */}
            <Footer/>
        </div>
    )
}

export default Graduates
