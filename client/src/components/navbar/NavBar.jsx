import React, { useRef, useState, useEffect } from 'react'

import './styles.css'

import sidebar_route from '../../assets/JsonData/sidebar_routes.json'

import { Toast } from 'react-bootstrap';
import { Tooltip } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getStudentQuery, getNotification, updateNotification } from '../../actions/overview';
import moment from 'moment'


const NavBar = props => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
    
    const overview = useSelector((state) => state.overviews)
    const query = useSelector((state) => state.overviews.query)

    const notification = useSelector((state) => state.overviews.notification)

    const [search, setSearch] = useState('')
    const [focus, setFocus] = useState(false)
    const [update, setUpdated] = useState(false)

    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getNotification())
    }, [dispatch])

    const clickNotification = (content_ref) => (e) => {
        if(notification !== undefined && notification.data.length > 0 && !update){
            dispatch(updateNotification(notification.data))

            overview.notification.count = 0
            setUpdated(true)
        }

        content_ref.current.classList.toggle('active')
        //console.log("class" +content_ref.current.classList)
        // user click toggle
        
        if (content_ref.current.classList.toggle('active')) {
            content_ref.current.classList.remove('active')
        } else {
            content_ref.current.classList.toggle('active')
        }
    }

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/admin/login')
        setUser(null)
    }

    const activeItem = sidebar_route.findIndex(item => item.route === props.location.pathname)
    const dropdown_content_el = useRef(null)

    const goto = (e) => {
        e.preventDefault()
        if(search.length > 0) {
            history.push(`/admin/search/${search}`)
            setSearch('')
        }
        overview.query = []
    }

    const search_student = (keyword) => {
        if(keyword.length > 2)
            dispatch(getStudentQuery({keyword: keyword}))
        else overview.query = []

    }
    
    const query_result = query ? query.map((item, i) => {
        return (
            <li key={i} onClick={() => window.location.href = `/admin/edit/${item.searchKey.student_number ? item.searchKey.student_number : `${item.searchKey.first_name}_${item.searchKey.last_name}`}`}>
                <span> {item.student_number} </span><br/>
                <label> {item.name} </label>
            </li>
        )
    }) : null

    const notification_content = notification !== undefined ? notification.data.map((item, index) => {
        
        return (
            <Toast style={{width: "100%", marginBottom: "5px"}} onClick={() => history.push('/admin/inbox')}>
                <Toast.Header closeButton={false}>
                    <div style={{width:"20px", height:"20px", background:"#191919", marginRight:"5px", borderRadius: "5px" }}></div>
                    <strong className="me-auto">{item.email} {item.notification_status === 'new' && <span style={{color: "red"}}>new</span>}</strong>
                    <small>{moment(item.createdAt).fromNow()}</small>
                </Toast.Header>
                <Toast.Body>
                    {item.message}

                </Toast.Body>
            </Toast>
        )
    }) : null
    const focusIn = () => setFocus(true)
    const focusOut = () => {
        setTimeout(function() {
            setFocus(false)
        }.bind(this), 150)
    }

    return (
        <nav style={{zIndex:1000}}>
            <div className="sidebar-button">
                <i ref={props.reference} className='bx bx-menu sidebarBtn' onClick={props.onClick}></i>
                <span className="dashboard">
                    {
                        activeItem >= 0 &&
                            window.location.href.indexOf(`${sidebar_route[activeItem].route}`) > -1 ? sidebar_route[activeItem].display_name : ''
                    }
                </span>
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    {/* dropdown here */}
                    {/* <Tooltip title="Logout">
                        <button onClick={logout} style={{margin: "0 5px", verticalAlign:"middle"}} className="dropdown__toggle">
                            <i className="bx bx-log-out"></i>
                        </button>
                    </Tooltip> */}
                    <button onClick={clickNotification(dropdown_content_el)} style={{margin: "0 15px", verticalAlign:"middle"}} className="dropdown__toggle">
                        <i className="bx bx-bell"></i>
                        {notification !== undefined && notification.count > 0 ? <span className='dropdown__toggle-badge'>{notification.count}</span>  : null }
                    </button>
                    <div ref={dropdown_content_el} className="dropdown__content">
                        <span className="notification__inner-label">Notifications</span>
                        {   
                            notification !== undefined && notification.data.length > 0 ?
                                notification_content
                                :
                                <p style={{textAlign:"center", marginTop:15}}> No new notification </p>

                        }
                    </div>
                </div>
                <form onSubmit={goto} id="studentSearch">
                    <div className="search-box">
                        <input type="search" id="search" placeholder="Search Student" value={search} name="search" onChange={(e) => {
                            setSearch(e.target.value);
                            search_student(e.target.value)
                        }}
                        onFocus={focusIn} onBlur={focusOut}
                        aria-label="Search" autoComplete="off"/>
                        <button type="submit" className="button"><i className='bx bx-search'></i></button>
                        {
                            focus ? 
                                query && query.length > 0 ? 
                                <div className="search-query">
                                    <ul>
                                        {query_result}
                                    </ul>
                                </div> : null
                            : null
                        }
                        
                    </div>
                    
                </form>
            </div>
        </nav>
    )
}

export default NavBar
