import React, { useEffect, useState, useRef } from 'react'
import { Navbar, Container, Collapse, NavDropdown, Nav, Button, Form } from 'react-bootstrap'

import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getAcademicYear, searchQuery } from '../../actions/home';
import { useMediaQuery } from 'react-responsive';

import decode from 'jwt-decode'

import logo from '../../images/logo/logo.png'

import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import EventIcon from '@material-ui/icons/Event';
import ImageIcon from '@material-ui/icons/Image';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import './styles.css'
const Header = () => {
    const isMobile = useMediaQuery({ query: `(max-width: 1000px)` });

    const home_year = useSelector((state) => state.home.year)
    const query = useSelector((state) => state.home.query)

    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
    const [focus, setFocus] = useState(false)
    const [input, setInput] = useState('')
    const [search,setSearch] = useState(user ? true : false)

    const [status, setStatus] = useState({
        academic_year: false,
        menu: false,
        account: false
    })

    useEffect(() => {
        dispatch(getAcademicYear())
    }, [])

    useEffect(() => {
        setOpen(true)
    }, [])

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')))

    }, [location])

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/login')
        setUser(null)
    }

    const batch_year = home_year !== undefined ? home_year.map((item) => {
        return (
            <NavDropdown.Item href={`/academic_year/${item.academic_year}`}>{item.academic_year}</NavDropdown.Item>
        )
    }) : null

    const focusIn = () => setFocus(true)
    const focusOut = () => {
        setTimeout(function() {
            setFocus(false)
        }.bind(this), 150)
    }

    const handleSearch = (e) => {
        setInput(e)
        if(e.length > 2 || e.length === 0) dispatch(searchQuery({keyword: e}))
    }   

    const handleSubmit = (e) => {
        e.preventDefault()
        if(input.length > 0) 
            if(search) window.location.href = `/search/${input}`
            else window.location.href = `/events/search/${input}`
        // history.push(`/search/${input}`)
    }

    const queryData = (query !== undefined && query.length > 0) ? query.map((item, i) => {
        return(
            <a href={`/alumni/${item.student_number}`} class="home-query-content" style={{ textDecoration: 'none' }}>
                <img src={item.image}/>
                <label>{item.name}</label>
                <span>{item.program}</span>
            </a>
        )
    }) : null
    
    const nav_ = useRef(null);
    const input_ = useRef(null);
    const nav_links = useRef(null)
    const openMenu = useRef(null)
    const closeMenu = useRef(null)
    const account_dropdown = useRef(null)
    const [dropdown, setDropdown] = useState({
        account: false,
    })
    useEffect(() => {
        if(input_ && input_.current){
            input_.current.addEventListener("click", (e) => {
                if(e.target.classList.contains("bx-x")) {
                    e.target.classList.replace("bx-x", "bx-search")
                    if(nav_.current !== null)
                        nav_.current.classList.remove('showInput')
                }
                else {
                    e.target.classList.replace("bx-search", "bx-x")
                    if(nav_.current !== null)
                        nav_.current.classList.toggle('showInput')
                }
            })
        }
        if(openMenu && openMenu.current){
            openMenu.current.addEventListener("click", (e) => {
                if(nav_links.current !== null) nav_links.current.style.left = "0";
            })
        }

        if(closeMenu && closeMenu.current){
            closeMenu.current.addEventListener("click", (e) => {
                if(nav_links.current !== null) nav_links.current.style.left = "-100%";
            })
        }

        if(account_dropdown && account_dropdown.current){
            account_dropdown.current.addEventListener("click", (e) => {
                if(nav_links.current !== null) nav_links.current.classList.toggle("show1")
                setDropdown({account: !dropdown.account})
            })
        }
    }, [])

    return (
        <nav className="header-nav">
            <div ref={nav_} className="navbar">
                <i ref={openMenu} className='bx bx-menu'></i>
                <div className="logo"><a href="/"> Mabalacat City College</a></div>
                <div ref={nav_links} className="nav-links">
                    <div className="sidebar-logo">
                    <span className="logo-name">Menu</span>
                    <i ref={closeMenu} className='bx bx-x' ></i>
                    </div>
                    <ul className="inner-links">
                        <li><a href="/"><i className="bx bxs-home" style={{fontSize:15}}></i> HOME</a></li>
                        {
                            user && user?.result.role === 'Student' ? <li><a href="/graduates"><i className="bx bxs-graduation" style={{fontSize:15}}></i> BATCH YEAR</a></li> : null
                        }

                        <li><a href="/events"><i className="bx bxs-calendar" style={{fontSize:15}}></i> EVENTS</a></li>
                        {
                            user && user?.result.role === 'Student' ? <li><a href="/gallery"><i className="bx bxs-image" style={{fontSize:15}}></i> GALLERY</a></li> : null
                        }
                        
                        {
                            user && user?.result.role !== 'Student' ? 
                                <>
                                    <li><a href="/admin"><i className="bx bxs-user" style={{fontSize:15}}></i> GOTO ADMIN</a></li> 
                                    <li onClick={logout} ><a href="#"><i className="bx bx-log-out" style={{fontSize:17, verticalAlign:"middle"}}></i> LOGOUT</a></li>
                                </>
                                : null
                        }

                        {
                            (user && user?.result.role === 'Student') &&
                                <li>
                                    <a ref={account_dropdown} href="#"><i className="bx bxs-user" style={{fontSize:15, verticalAlign:"middle"}}></i> ACCOUNT</a>
                                    <i className='bx bxs-chevron-down htmlcss-arrow arrow'></i>
                                        <ul className="htmlCss-sub-menu sub-menu">
                                            <li><a href="/order">Request Yearbook</a></li>
                                            <li><a href="/yearbook">Download</a></li>
                                            <li><a href={`/alumni/${user.result.student_number ? user.result.student_number : user.result.alumni_id}`}>Profile</a></li>
                                            <li><a href="/change_password">Account Manage</a></li>
                                            <li><a href="/help">Help</a></li> 
                                            <li onClick={logout}><a href="#"><i className="bx bx-log-out" style={{fontSize:17, verticalAlign:"middle"}}></i> Logout</a></li>
                                        </ul>
                                </li>
                        }
                        {
                            !user ? 
                                <>
                                    <li><a href="/help"><i className="bx bx-help-circle" style={{fontSize:17, verticalAlign:"middle"}}></i> HELP</a></li> 
                                    <li><a href="/login"><i className="bx bx-log-in" style={{fontSize:17, verticalAlign:"middle"}}></i> LOGIN</a></li> 
                                </>: null
                        }
                        
                        {/* <li>
                            <a href="#">HTML & CSS</a>
                            <i className='bx bxs-chevron-down htmlcss-arrow arrow  '></i>
                            <ul className="htmlCss-sub-menu sub-menu">
                            <li><a href="#">Web Design</a></li>
                            <li><a href="#">Login Forms</a></li>
                            <li><a href="#">Card Design</a></li>
                            <li className="more">
                                <span><a href="#">More</a>
                                <i className='bx bxs-chevron-right arrow more-arrow'></i>
                            </span>
                                <ul className="more-sub-menu sub-menu">
                                <li><a href="#">Neumorphism</a></li>
                                <li><a href="#">Pre-loader</a></li>
                                <li><a href="#">Glassmorphism</a></li>
                                </ul>
                            </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">JAVASCRIPT</a>
                            <i className='bx bxs-chevron-down js-arrow arrow '></i>
                            <ul className="js-sub-menu sub-menu">
                            <li><a href="#">Dynamic Clock</a></li>
                            <li><a href="#">Form Validation</a></li>
                            <li><a href="#">Card Slider</a></li>
                            <li><a href="#">Complete Website</a></li>
                            </ul>
                        </li> */}
                    </ul>
                </div>
                <div className="nav-search-box">
                    <i ref={input_} className='bx bx-search'></i>
                    <div className="input-box" >
                        <Form onSubmit={handleSubmit}>
                            <input type="text" value={input} onChange={(e) => handleSearch(e.target.value)} placeholder="Search..."/>
                            {
                                user ?
                                    <Form.Check checked={search} onClick={() => setSearch(!search)} type="checkbox" label="Batch Alumni" />  
                                : null
                            }                                 
                        </Form>
                    </div>
                </div>
            </div>
        </nav>
        // <Collapse in={open}>
            
        //     <Navbar collapseOnSelect expand="lg" style={{backgroundColor:"#8B0000"}} sticky="top" variant="dark">
        //         {/* <Container> */}
        //             <Navbar.Brand href="/" style={{lineHeight:2.2, fontSize:23, fontWeight:500}}>
        //                     <img
        //                         alt=""
        //                         src={logo}
        //                         width="50"
        //                         height="50"
        //                         className="d-inline-block align-top"
        //                     />{' '}
        //                     Mabalacat City College
        //             </Navbar.Brand>
                    
        //             <Navbar.Toggle style={{fontSize:15}} aria-controls="responsive-navbar-nav" />
        //             <Form onSubmit={handleSubmit} id="alumni-search_mobile">
        //                     <div className="home-search-box">
        //                         <input type="search" id="search" value={input} onChange={(e) => handleSearch(e.target.value)} onFocus={focusIn} onBlur={focusOut} placeholder="Search" name="search" aria-label="Search" autocomplete="off"/>
        //                         <button type="submit" className="button"><i className='bx bx-search'></i></button>
        //                         {                                
        //                             focus ? 
        //                                 <div className="home-search-query" > 
        //                                     {queryData}
        //                                 </div>
        //                             : null
        //                         }                             
        //                     </div>                          
        //             </Form>
        //             <Navbar.Collapse id="responsive-navbar-nav">
        //                 <Nav className="me-auto">
        //                     <Nav.Link href="/"><HomeIcon/> Home</Nav.Link>
        //                     <i class="bi bi-card-list"></i>

        //                     <NavDropdown  title="Batch Year" id="collapsible-nav-dropdown"
        //                         onMouseEnter={() => !isMobile && setStatus({...status, academic_year: true, menu: false, account: false})}
        //                         onMouseLeave={() => !isMobile && setStatus({...status, academic_year: false})}
        //                         onClick={() => setStatus({...status, academic_year: !status.academic_year})}
        //                         show = {status.academic_year}
        //                     >
        //                         {home_year !== undefined && home_year.length < 1 ? <NavDropdown.Item disabled> No Year Available</NavDropdown.Item> : null}
        //                         {status.academic_year ? batch_year: null}
        //                     </NavDropdown>

        //                     <NavDropdown  title={<><MenuIcon/> Menu    </>} id="collapsible-nav-dropdown"
        //                         onClick={() => setStatus({...status, menu: !status.menu})}
        //                         onMouseEnter={() => !isMobile && setStatus({...status, menu: true, academic_year: false, account: false})}
        //                         onMouseLeave={() => !isMobile && setStatus({...status, menu: false})}
        //                         show = {status.menu}
        //                     >
        //                         {status.menu ? 
        //                             <>
        //                             <NavDropdown.Item href={`/events`}><EventIcon/> Events</NavDropdown.Item>
        //                             <NavDropdown.Item href={`/graduates`}><i className="bx bxs-graduation" style={{fontSize:25, verticalAlign:"middle"}}></i> Graduates</NavDropdown.Item>
        //                             <NavDropdown.Item href={`/gallery`}><ImageIcon/> Gallery</NavDropdown.Item>
        //                             </>
        //                         : null}
        //                     </NavDropdown>

        //                     {
        //                         (user && user?.result.role === 'Student') &&
        //                         <NavDropdown title="Account" id="collasible-nav-dropdown"
        //                             onClick={() => setStatus({...status, account: !status.account})}
        //                             onMouseEnter={() => !isMobile && setStatus({...status, account: true, academic_year: false, menu: false})}
        //                             onMouseLeave={() => !isMobile && setStatus({...status, account: false})}
        //                             show = {status.account}
        //                             >
        //                             { 
        //                                 status.account ?
        //                                     <>
        //                                         <NavDropdown.Item href={`/order`}><ShoppingBasketIcon/> Order</NavDropdown.Item>
        //                                         <NavDropdown.Item href={`/yearbook`}><i className="bx bxs-download" style={{fontSize:20, verticalAlign:"middle"}}></i> Yearbook</NavDropdown.Item>
        //                                         <NavDropdown.Item href={`/alumni/${user.result.student_number}`}> <i className="bx bxs-user" style={{fontSize:20, verticalAlign:"middle"}}></i>Profile</NavDropdown.Item>
        //                                         <NavDropdown.Item href={`/change_password`}><i className="bx bxs-lock" style={{fontSize:20, verticalAlign:"middle"}}></i> Change Password</NavDropdown.Item>
        //                                         <NavDropdown.Item onClick={logout}><i className="bx bx-log-out" style={{fontSize:20, verticalAlign:"middle"}}></i> Logout</NavDropdown.Item>
        //                                     </>
        //                                 : null
        //                             }
                                    
        //                         </NavDropdown>
        //                         // <>
        //                         //     <Nav.Link href="/order">Order</Nav.Link>
        //                         //     <Nav.Link href="/download">Download</Nav.Link>
        //                         // </>
        //                     }
        //                 </Nav>
                    
        //                 <Nav>
        //                     {
        //                         !user ? 
        //                             <Button href="/login" variant="outline-light" style={{padding:"10px"}}><i className="bx bx-log-in" style={{fontSize:20, verticalAlign:"middle"}}></i> Login</Button>
        //                         : null
        //                     }
        //                     {/* {
        //                         user ? 
        //                         <Button onClick={logout} variant="outline-light" style={{padding:"10px"}}><i className="bx bx-log-out" style={{fontSize:20, verticalAlign:"middle"}}></i> Logout</Button>
        //                         :
        //                         <Button href="/login" variant="outline-light" style={{padding:"10px"}}><i className="bx bx-log-in" style={{fontSize:20, verticalAlign:"middle"}}></i> Login</Button>
        //                     }                 */}
        //                 </Nav>

        //                 <Form onSubmit={handleSubmit} id="alumni-search_desktop">
        //                     <div className="home-search-box">
        //                         <input type="search" id="search" value={input} onChange={(e) => handleSearch(e.target.value)} onFocus={focusIn} onBlur={focusOut} placeholder="Search Alumni" name="search" aria-label="Search" autocomplete="off"/>
        //                         <button type="submit" className="button"><i className='bx bx-search'></i></button>
        //                         {
        //                             focus ? 
        //                                 <div className="home-search-query" > 
        //                                     {queryData}
        //                                 </div>
        //                             : null
        //                         }
                                
        //                     </div>
                            
        //                 </Form>
        //             </Navbar.Collapse>
        //         {/* </Container> */}
        //     </Navbar>
        // </Collapse>
    )
}

export default Header

// // search-box open close js code
// let navbar = document.querySelector(".navbar");
// let searchBox = document.querySelector(".search-box .bx-search");
// // let searchBoxCancel = document.querySelector(".search-box .bx-x");

// searchBox.addEventListener("click", ()=>{
//     navbar.classList.toggle("showInput");
//         if(navbar.classList.contains("showInput")){
//             searchBox.classList.replace("bx-search" ,"bx-x");
//         }else {
//             searchBox.classList.replace("bx-x" ,"bx-search");
//         }
// });

// // sidebar open close js code
// let navLinks = document.querySelector(".nav-links");
// let menuOpenBtn = document.querySelector(".navbar .bx-menu");
// let menuCloseBtn = document.querySelector(".nav-links .bx-x");

// menuOpenBtn.onclick = function() {
//     navLinks.style.left = "0";
// }

// menuCloseBtn.onclick = function() {
//     navLinks.style.left = "-100%";
// }


// // sidebar submenu open close js code
// let htmlcssArrow = document.querySelector(".htmlcss-arrow");
// htmlcssArrow.onclick = function() {
//     navLinks.classList.toggle("show1");
// }

// let moreArrow = document.querySelector(".more-arrow");
// moreArrow.onclick = function() {
//     navLinks.classList.toggle("show2");
// }

// let jsArrow = document.querySelector(".js-arrow");
// jsArrow.onclick = function() {
//     navLinks.classList.toggle("show3");
// }