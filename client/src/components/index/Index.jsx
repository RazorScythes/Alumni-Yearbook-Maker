import React, { useState, useEffect } from 'react'
import Sidebar from '../sidebar/Sidebar'
import NavBar from '../navbar/NavBar'

import Routes from '../Routes'
import UserRoutes from '../UserRoutes'
import { useMediaQuery } from 'react-responsive';

import { useHistory } from 'react-router-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import AdminLogin from '../login/AdminLogin';
import './styles.css'

const Index = () => {

    const isMobile = useMediaQuery({ query: `(max-width: 1000px)` });
    const [SidebarOpen, setSideBarOpen] = useState(0)
    const userData = JSON.parse(localStorage.getItem('profile'))
    const [user, setUser] = useState(userData? userData : null)

    const toggle_Sidenav = (content_ref, toggle_ref, label1, label2, label3, label4) => (e) => {
        //console.log("side"+SidebarOpen)
            if(SidebarOpen){
                    //content_ref.current.classList.remove('active')  
                    content_ref.current.classList.toggle('active')              
                    toggle_ref.current.classList.replace("bx-menu-alt-right", "bx-menu");
                    if(isMobile){
                        label1.current !== null && label1.current.classList.replace("sub_label-active", "sub_label")
                        label2.current !== null && label2.current.classList.replace("sub_label-active", "sub_label")
                        label3.current !== null && label3.current.classList.replace("sub_label-active", "sub_label")
                        label4.current !== null && label4.current.classList.replace("sub_label-active", "sub_label")
                    }
                    setSideBarOpen(0)
            }
            else{
                    //content_ref.current.classList.toggle('active')
                    content_ref.current.classList.remove('active')  
                    toggle_ref.current.classList.replace("bx-menu" ,"bx-menu-alt-right");
                    if(isMobile){ 
                        label1.current !== null && label1.current.classList.replace("sub_label", "sub_label-active")
                        label2.current !== null && label2.current.classList.replace("sub_label", "sub_label-active")
                        label3.current !== null && label3.current.classList.replace("sub_label", "sub_label-active")
                        label4.current !== null && label4.current.classList.replace("sub_label", "sub_label-active") 
                    }
                    setSideBarOpen(1)
            }
    }

    useEffect(() => {
        if(isMobile){
            sidebar_el.current  !== null && sidebar_el.current.classList.remove('active') 
            i_button.current    !== null && i_button.current.classList.replace("bx-menu" ,"bx-menu-alt-right");   
            label_el1.current   !== null && label_el1.current.classList.replace("sub_label", "sub_label-active")
            label_el2.current   !== null && label_el2.current.classList.replace("sub_label", "sub_label-active")
            label_el3.current   !== null && label_el3.current.classList.replace("sub_label", "sub_label-active")
            label_el4.current   !== null && label_el4.current.classList.replace("sub_label", "sub_label-active")
            setSideBarOpen(1)
        }
        else {
            sidebar_el.current  !== null && sidebar_el.current.classList.remove('active')
            label_el1.current   !== null  && label_el1.current.classList.replace("sub_label-active", "sub_label")
            label_el2.current   !== null  && label_el2.current.classList.replace("sub_label-active", "sub_label")
            label_el3.current   !== null  && label_el3.current.classList.replace("sub_label-active", "sub_label")
            label_el4.current   !== null  && label_el4.current.classList.replace("sub_label-active", "sub_label")
            setSideBarOpen(1)      
        }
    }, [isMobile]);

    const sidebar_el = React.createRef(null);
    const i_button = React.createRef(null);
    const label_el1 = React.createRef(null);
    const label_el2 = React.createRef(null);
    const label_el3 = React.createRef(null);
    const label_el4 = React.createRef(null);

    const Redirect = () => {
        const history = useHistory()
        useEffect(() => {
            if(!user) history.push('/admin/login')
        }, [])
        
        return(
            <>
                
            </>
        )
    }

    return (
        <BrowserRouter>  
            <Route render={(props) => (
                <>
                    {
                        ( !props.location.pathname.includes("/login") && props.location.pathname.includes("/admin")) &&
                            user?.result ?
                                user?.result.role !== "Student" ?
                                <>
                                    <Sidebar
                                        {...props}
                                        reference={sidebar_el}
                                        label1={label_el1}
                                        label2={label_el2}
                                        label3={label_el3}
                                        label4={label_el4}
                                    />
                                
                                    <section className="home-section">
                                    
                                        <NavBar
                                            {...props}
                                            reference={i_button}
                                            onClick={toggle_Sidenav(sidebar_el,i_button,label_el1, label_el2, label_el3, label_el4)}
                                        />

                                        <div className="home-content"> 
                                            <Routes/>
                                        </div>
                                    </section>
                                </> :   <div className="error_display">
                                            <div className="fof">
                                                <h1>Error 401 - Unauthorized</h1>
                                                <p> You don't have permission to view this page </p>
                                            </div>
                                        </div>
                            : !props.location.pathname.includes("/admin") ?
                                <UserRoutes/> : <Redirect/>
                    }
                    {/* (!props.location.pathname.includes("/login") && !props.location.pathname.includes("/admin"))  */}
                    {
                        props.location.pathname.includes("/admin/login") && <AdminLogin setUser={setUser}/>
                    }
                </>
            )}/>
        </BrowserRouter>
    )
}

export default Index
