import React, { useState, useEffect } from 'react'

import './styles.css'

import SidebarList from './SidebarList';

import sidebar_route from '../../assets/JsonData/sidebar_routes.json'

import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { institute_list } from '../../assets/JsonData/institute';

import { Avatar } from '@material-ui/core';

import decode from 'jwt-decode'
import Logo from '../../images/transparent/logo_transparent.png'
const Sidebar = props => {
    const [expand_institute, setExpandInstitute] = useState(0)
    const [expand_em, setExpandEM] = useState(0)
    const [expand_yearbook, setExpandYearbook] = useState(0)

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {      
        document.title = "Admin Panel"
    }, [])
    
    useEffect(() => {
        if(!user) history.push('/admin/login')
        
        if(user?.result.role === 'Student') history.push('/')

        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')))

    }, [location])

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/admin/login')
        setUser(null)
    }

    const getInstitute = institute_list.map((item, index) => {
        return(
            <Link key={index} to={item.route} style={{ textDecoration: 'none' }}>
                <SidebarList
                    displayName = {item.acronym}
                    active = {window.location.href.indexOf(`${item.route}`) > -1}
                    icon = "bx bxs-graduation"
                    dropdown = "dropdown_content"
                />
            </Link>
        )
    })
    return (
        <div ref={props.reference} className="sidebar">
            <div className="logo-details">
                {/* <Avatar className="logo_" alt={user.result.name} src={user.result.imageUrl}>
                    {user.result.name.charAt(0)}
                </Avatar> */}
                <img className="logo_" alt={user.result.name} src={Logo}/>
                <span className="logo_name">{user?.result.name}<br/> <span className="user_role"> {user?.result.role} </span> </span>
            </div>
            <ul className="nav-links">
                <div className="sub_label">
                    <hr/>
                </div>


                <Link to={sidebar_route[0].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Overview"
                        icon = "bx bx-grid-alt"
                        active = {sidebar_route[0].route === props.location.pathname}
                    />
                </Link>
                

                <div ref={props.label1} className="sub_label">
                    <hr/>
                    <span>DESIGN</span>
                
                <Link to={sidebar_route[1].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Batch Template"
                        icon = "bx bx-layout"
                        active = { window.location.href.indexOf(`${sidebar_route[1].route}`) > -1 }
                    />
                </Link>
                <Link to={sidebar_route[2].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Yearbook"
                        icon = "bx bxs-book"
                        active = { window.location.href.indexOf(`${sidebar_route[2].route}`) > -1 }
                        full_expand={true}
                        expand = {true}
                        value = {expand_yearbook}
                        setExpand={setExpandYearbook}
                    />
                </Link>
                {
                    expand_yearbook ?
                    <div>
                        <Link to={`${sidebar_route[2].route}/pdf-control`} style={{ textDecoration: 'none' }}>
                            <SidebarList
                                displayName = "PDF Control"
                                icon="bx bx-file-blank"
                                active = { window.location.href.indexOf(`${sidebar_route[2].route}/pdf-control`) > -1 }
                            />
                        </Link>
                        <Link to={`${sidebar_route[2].route}/orders`} style={{ textDecoration: 'none' }}>
                            <SidebarList
                                displayName = "Requests"
                                icon="bx bx-info-circle"
                                active = { window.location.href.indexOf(`${sidebar_route[2].route}/orders`) > -1 }
                            />
                        </Link>
                    </div> : null
                }   
                </div>
                <div ref={props.label2} className="sub_label">
                    <hr/>
                    <span>ALUMNI</span>
                <Link to={sidebar_route[3].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Institute"
                        icon = "bx bx-list-check"
                        active = { window.location.href.indexOf(`${sidebar_route[3].route}`) > -1 }
                        // expand = {true}
                        // value = {expand_institute}
                        // setExpand={setExpandInstitute}
                    />
                </Link>
                {expand_institute ? <div> {getInstitute} </div>: null}
                </div>


                <div ref={props.label3} className="sub_label">
                    <hr/>
                    <span>CONTENT</span>
                <Link to={sidebar_route[4].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Administration"
                        icon = "bx bx-user-check"
                        active = {sidebar_route[4].route === props.location.pathname}
                    />
                </Link>
                <Link to={sidebar_route[5].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Gallery"
                        icon = "bx bx-image"
                        active = {sidebar_route[5].route === props.location.pathname}
                    />
                </Link>
                <Link to={sidebar_route[6].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Honor And Awards"
                        icon = "bx bx-award"
                        active = {sidebar_route[6].route === props.location.pathname}
                    />
                </Link>
                <Link to={sidebar_route[7].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "News & Events"
                        icon = "bx bx-paperclip"
                        active = { window.location.href.indexOf(`${sidebar_route[7].route}`) > -1 }
                        expand = {true}
                        full_expand={true}
                        value = {expand_em}
                        setExpand={setExpandEM}
                    />
                </Link> 
                {
                    expand_em ?
                    <div>
                        <Link to={`${sidebar_route[7].route}/news`} style={{ textDecoration: 'none' }}>
                            <SidebarList
                                displayName = "News"
                                icon="bx bx-news"
                                active = { window.location.href.indexOf(`${sidebar_route[7].route}/news`) > -1 }
                            />
                        </Link>
                        <Link to={`${sidebar_route[7].route}/events`} style={{ textDecoration: 'none' }}>
                            <SidebarList
                                displayName = "Events"
                                icon="bx bx-calendar-event"
                                active = { window.location.href.indexOf(`${sidebar_route[7].route}/events`) > -1 }
                            />
                        </Link>
                    </div> : null
                }   
                </div>


                <Link to={sidebar_route[8].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Commence"
                        icon = "bx bx-message-rounded-edit"
                        active = {sidebar_route[8].route === props.location.pathname}
                    />
                </Link>

                <div ref={props.label4} className="sub_label">
                    <hr/>
                    <span>CONCERN/ISSUE MESSAGE</span>
                </div>

                <Link to={sidebar_route[9].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "Inbox"
                        icon = "bx bx-mail-send"
                        active = {sidebar_route[9].route === props.location.pathname}
                    />
                </Link>

                <div ref={props.label4} className="sub_label">
                    <hr/>
                    <span>ACCOUNT</span>
                </div>


                <Link to={sidebar_route[10].route} style={{ textDecoration: 'none' }}>
                    <SidebarList
                        displayName = "My Account"
                        icon = "bx bx-user-circle"
                        active = {sidebar_route[10].route === props.location.pathname}
                    />
                </Link>
                {
                    user?.result.role === 'Admin' && 
                    <Link to={sidebar_route[11].route} style={{ textDecoration: 'none' }}>
                        <SidebarList
                            displayName = "Manage Accounts"
                            icon = "bx bx-user-pin"
                            active = {sidebar_route[11].route === props.location.pathname}
                        />
                    </Link>
                }
                <Link style={{ textDecoration: 'none' }} onClick={logout}>
                    <SidebarList
                        displayName = "Logout"
                        icon = "bx bx-log-out"
                        logout = "log_out"
                    />
                </Link>


            </ul>
        </div>
    )
}

export default Sidebar
