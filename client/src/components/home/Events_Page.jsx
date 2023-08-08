import React, { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Pagination, Container, Alert, Form } from 'react-bootstrap'
import Events from './Pagination/Events'
import { getAllEvent } from '../../actions/home'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'

import template from '../../images/template.jpg'

const Events_Page = props => { 
    const all_event = useSelector((state) => state.home.all_event)

    const home = useSelector((state) => state.home)

    const dispatch = useDispatch()
    const history = useHistory()

    const itemPerPage = 10

    const [active, setActive] = useState(props.match.params.page ? parseInt(props.match.params.page) : 1)
    const [loading, setLoading] = useState(true)
    const [paginate, setPaginate] = useState(1)
    const [input, setInput] = useState('')

    const [err, showErr] = useState({
        show: false,
        message: ''
    })

    const [complex, setComplex] = useState([])
    useEffect(() => {
        if(all_event){
            let startVal = all_event.length / itemPerPage
            let page_count = all_event.length <= itemPerPage ? 1 : Math.floor(startVal) + ( startVal - Math.floor(startVal) != 0 ? 1 : 0)
            if(page_count >= 10){
                let center_page = parseInt(props.match.params.page)
                setComplex([1, center_page - 2, center_page - 1, center_page, center_page + 1, center_page +2, page_count])
            }
            setPaginate(page_count)
        }

        if(home.message){
            showErr({...err, 
                show: true,
                message: home.message.message
            })
            home.message.message = ''
        }
    }, [home.all_event, home.message])

    useEffect(() => {
        document.title = "Events"
        if(props.match.params.keyword) dispatch(getAllEvent({keyword: props.match.params.keyword}))
        else dispatch(getAllEvent())
    }, [dispatch, props.match.params.keyword])

    const number = [...Array(paginate)].map((item, i) => {
 
        return(
                // <Pagination.Item onClick={() => setActive(i+1)} key={i+1} active={i+1 === active}>
                <Pagination.Item onClick={() => window.location.href=`/events/page/${i+1}`} key={i+1} active={i+1 === active}>
                        {i+1}
                </Pagination.Item>
        )
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if(props.match.params.keyword && input.length > 0){
            window.location.href = `/events/search/${input}`
            // history.push(`/events/search/${input}`)
        }
        else if(input.length > 0) {
            window.location.href = `/events/search/${input}`
            // history.push(`/events/search/${input}`)
            home.all_event = []
        }
    }

    return (
        <div>
            <Header/>

            <Container>
                <div style={{marginTop:15}}>
                    <Form onSubmit={handleSubmit}>
                        <div className="event-search-box">
        
                            <input type="search" onChange={(e) => setInput(e.target.value)} id="search" placeholder="Search" name="search" aria-label="Search" autocomplete="off"/>
                            <button type="submit" className="button"><i className='bx bx-search'></i></button>     
                            {props.match.params.keyword ? <label> -Keyword: {props.match.params.keyword}</label> : null}
                            <label>Total Results: {all_event !== undefined && all_event.length > 0 ? all_event.length : 0}</label>
                        </div>  
                    </Form>
                    {
                        all_event !== undefined && all_event.length > 0 ? 
                            <>
                                <Events data={all_event} page={active} itemPerPage={itemPerPage}/>
                                <div style={{display: "inline-block", width:"100%"}}> 
                                    {
                                        complex.length > 0 ?
                                            props.match.params.page >= 3 ?
                                                props.match.params.page >= (paginate - 3) ? 
                                                    <Pagination style={{float:"right"}}>
                                                        <Pagination.First onClick={() => window.location.href=`/events/page/${1}`}/>
                                                        <Pagination.Prev onClick={() => window.location.href=`/events/page/${parseInt(props.match.params.page) - 1}`}/>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${paginate - 6}`} active={paginate - 6 === active}>{paginate - 6}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${paginate - 5}`} active={paginate - 5 === active}>{paginate - 5}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${paginate - 4}`} active={paginate - 4 === active}>{paginate - 4}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${paginate - 3}`} active={paginate - 3 === active}>{paginate - 3}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${paginate - 2}`} active={paginate - 2 === active}>{paginate - 2}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${paginate - 1}`} active={paginate - 1 === active}>{paginate - 1}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${paginate}`} active={paginate === active}>{paginate}</Pagination.Item>
                                                    </Pagination>
                                                    :
                                                    <Pagination style={{float:"right"}}>
                                                        <Pagination.First onClick={() => window.location.href=`/events/page/${1}`}/>
                                                        <Pagination.Prev onClick={() => window.location.href=`/events/page/${parseInt(props.match.params.page) - 1}`}/>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${complex[0]}`} active={complex[0] === active}>{complex[0]}</Pagination.Item>
                                                        <Pagination.Ellipsis />

                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${complex[1]}`} active={complex[1] === active}>{complex[1]}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${complex[2]}`} active={complex[2] === active}>{complex[2]}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${complex[3]}`} active={complex[3] === active}>{complex[3]}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${complex[4]}`} active={complex[4] === active}>{complex[4]}</Pagination.Item>
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${complex[5]}`} active={complex[5] === active}>{complex[5]}</Pagination.Item>

                                                        <Pagination.Ellipsis />
                                                        <Pagination.Item onClick={() => window.location.href=`/events/page/${complex[6]}`} active={complex[6] === active}>{complex[6]}</Pagination.Item>
                                                        <Pagination.Next onClick={() => window.location.href=`/events/page/${parseInt(props.match.params.page) + 1}`}/>
                                                        <Pagination.Last onClick={() => window.location.href=`/events/page/${paginate}`}/>
                                                    </Pagination>
                                            : 
                                            <Pagination style={{float:"right"}}>
                                                
                                                <Pagination.Item onClick={() => window.location.href=`/events/page/${1}`} active={1 === active}>1</Pagination.Item>
                                                <Pagination.Item onClick={() => window.location.href=`/events/page/${2}`} active={2 === active}>2</Pagination.Item>
                                                <Pagination.Item onClick={() => window.location.href=`/events/page/${3}`} active={3 === active}>3</Pagination.Item>
                                                <Pagination.Item onClick={() => window.location.href=`/events/page/${4}`} active={4 === active}>4</Pagination.Item>
                                                <Pagination.Item onClick={() => window.location.href=`/events/page/${5}`} active={5 === active}>5</Pagination.Item>
                                                <Pagination.Item onClick={() => window.location.href=`/events/page/${6}`} active={6 === active}>6</Pagination.Item>
                                                <Pagination.Item onClick={() => window.location.href=`/events/page/${7}`} active={7 === active}>7</Pagination.Item>
                                                <Pagination.Next onClick={() => window.location.href=`/events/page/${parseInt(props.match.params.page) + 1}`}/>
                                                <Pagination.Last onClick={() => window.location.href=`/events/page/${paginate}`}/>
                                            </Pagination>
                                        :
                                        <Pagination style={{float:"right"}}>{number}</Pagination>
                                    }
                                </div>
                            </>
                        :  err.show ?
                            <div style={{height:"50vh"}}>
                                <Alert variant="danger">
                                    {err.message}
                                </Alert> 
                            </div>
                            : <div style={{height:"50vh"}}> </div>
                    }
                </div>
            </Container>
            
            <Footer/>
        </div>
    )
}

export default Events_Page
