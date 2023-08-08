import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer';

import Slide from 'react-reveal/Slide';
import { Carousel, Container, Spinner } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { getAlumniProfile } from '../../actions/home';
import { useHistory } from 'react-router';

import template from '../../images/1.png'
import main from '../../images/main.jpg'
const Alumni = props => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const home = useSelector((state) => state.home)
    const home_profile = useSelector((state) => state.home.profile)

    const dispatch = useDispatch()
    const history = useHistory()

    const [err, showErr] = useState({
        show: false,
        message: '',
        additional: ''
    })

    useEffect(() => {
        document.title = "Alumni"

        if(!user) history.push('/')
        else dispatch(getAlumniProfile({
            alumni_id: user.result.alumni_id,
            student_number: props.match.params.id
        }))
    }, [user, dispatch])

    useEffect(() => {
        if(home.message){
            showErr({...err, 
                show: true,
                message: home.message.message,
                additional: home.message.additional
            })
            home.message.message = ''
            home.message.additional = ''
        }
    }, [home.message])

    const NotFound = () => {
        return (
            <div className="error_display-home">
                <div className="fof">
                    <h1>{err.message}</h1>
                    <p>{err.additional ? err.additional : null}</p>
                </div>
            </div>
        )
    }

    const related_content = (data) => data.map((item) => {
        return (
            <a href={`/alumni/${item.student_number ? item.student_number : `${item.full_name.first_name}_${item.full_name.last_name}`}`}>
                <div>
                    <img src={item.main}/>
                    <label>{`${item.full_name.last_name}, ${item.full_name.first_name}`}</label>
                </div>    
            </a>
        )
    })
    const related_container = home_profile !== undefined ? home_profile.related.map((item) => {
        return (
            <Carousel.Item>
                <div className="alumni__related-container">
                    {related_content(item)}
                </div>
            </Carousel.Item>
        )
    }) : null

    return (    
        <div>
            <Header/>
 
            { 
                home_profile ? 
                <>
                <main className="alumni__wrap">
                    <div className="alumni__header black">
                        <h4>A.Y {home_profile.profile.batch_id.academic_year}</h4>
                        <label>{home_profile.profile.section_id.institute_name}</label>
                        <span>{home_profile.profile.section_id.program}</span>
                        <hr/>
                    </div>

                    <section className="alumni__grid-image">
                        {
                            (home_profile.profile.main !== '' && home_profile.profile.main) &&
                            <Slide left><img src={home_profile.profile.main} className="alumni__grid-main"/></Slide>
                        }
                        {
                            (home_profile.profile.img1 || home_profile.profile.img2) &&
                            <Slide top>
                                <div className="alumni__second-image">
                                    {
                                        (home_profile.profile.img1 !== '' && home_profile.profile.img1) &&
                                        <img src={home_profile.profile.img1} className="alumni__grid-sub"/>
                                    }
                                    {
                                        (home_profile.profile.img2 !== '' && home_profile.profile.img2)  &&
                                        <img src={home_profile.profile.img2} className="alumni__grid-extra1"/>
                                    }
                                </div>
                            </Slide>                         
                        }
                        {
                            (home_profile.profile.img3 !== '' && home_profile.profile.img3) &&
                            <Slide right> <img src={home_profile.profile.img3} className="alumni__grid-extra2"/> </Slide>
                        }
                        
                    </section>
                    <Container>
                    <Slide bottom>
                        <div className="alumni__title_header black">
                            <label> {`${home_profile.profile.full_name.last_name}, ${home_profile.profile.full_name.first_name} ${home_profile.profile.full_name.middle_name ? home_profile.profile.full_name.middle_name.charAt(0)+'.' : ''}`} </label>
                            {
                                home_profile.profile.quotes &&
                                    <span>" {home_profile.profile.quotes} "</span>
                            }
                        </div>
                    </Slide>
                    </Container>
                </main>
                {
                    home_profile.related.length > 0 ?
                    <>
                        <h3 className="hr__separator gray">RELATED ALUMNI</h3>

                        <Carousel interval={null} prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon alumni" />} nextIcon={<span aria-hidden="true" className="carousel-control-next-icon alumni" />} indicators={false} className="alumni__related" variant="dark">
                            {related_container}
                        </Carousel>
                    </> : null     
                }
                </>: 
                err.show ?
                    <NotFound/> 
                    : 
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

export default Alumni
