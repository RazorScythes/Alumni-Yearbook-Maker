import React, { useEffect, useState } from 'react'
import Header from './Header';
import Footer from './Footer';
import { Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getQuery } from '../../actions/home';
import Slide from 'react-reveal/Slide';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useHistory } from 'react-router';

import './styles.css'
import logo from '../../images/logo/logo.png'
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

const Query = props => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const search = useSelector((state) => state.home.search)

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        document.title = "Search"
        if(!user) history.push('/')
        else dispatch(getQuery({
            alumni_id: user?.result.alumni_id,
            keyword: props.match.params.keyword
        }))

    }, [dispatch, props.match.params.keyword])

    const displayContent = search !== undefined ? search.map((item, i) => {
        console.log(item)
        return (
            <a key={i} href={`/alumni/${item.searchKey.student_number ? item.searchKey.student_number : `${item.searchKey.first_name}_${item.searchKey.last_name}`}`} class="alumni__display" style={{ textDecoration: 'none' }}>
                <LazyLoadImage
                    wrapperClassName="main__image"
                    alt={item.image}
                    effect="blur"
                    src={item.image} 
                />
                <div class="nametag__container" style={{color: item.nametag_props.color}}>
                    <img src={item.nametag} class="nametag"/>
                    <label style={{bottom: item.quotes ? item.nametag_props.name : (item.nametag_props.name - item.nametag_props.name/3) }}>{item.name}</label>
                    <span style={{bottom: item.nametag_props.quotes}}>{item.nametag_props.checked ? item.quotes ? <LongText showdot={false} content = {`${item.quotes}`} limit = {36} /> : '' : null}</span>
                </div>
            </a>
        )
    }) : null

    return (
        <div>
            <Header/>

            <Container style={{margin: "20px auto",}} className='home__body'>
                {
                    search !== undefined && search.length > 0 ?
                        <>
                            <h3> Match Found : {search.length} </h3>
                            <hr/>
                            <Slide bottom>
                                <>
                                    {displayContent}
                                </>
                            </Slide>
                        </>
                    : 
                    <div style={{height:"70vh"}}>
                      <Alert variant="danger">
                        No result found matching with the keyword = "{props.match.params.keyword}".
                      </Alert>
                    </div>
                }
            </Container>

            <Footer/>
        </div>
    )
}

export default Query
