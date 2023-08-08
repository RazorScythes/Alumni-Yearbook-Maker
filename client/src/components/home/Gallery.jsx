import React, { useState, useEffect } from 'react'
import Header from './Header';
import Footer from './Footer';
import { Container, Spinner } from 'react-bootstrap';
import Gallery from 'react-photo-gallery'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getBatchGallery } from '../../actions/home';

const Home_Gallery = () => {

    const gallery = useSelector((state) => state.home.gallery)
    const error_message = useSelector((state) => state.home.message)

    const dispatch = useDispatch()
    const history = useHistory()

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    useEffect(() => {
      document.title = "Gallery"
      if(!user) history.push('/')
      else dispatch(getBatchGallery({alumni_id: user?.result.alumni_id}))
    }, [dispatch])
    
    return (
        <div>
            <Header/>
            
            <Container>
              {
                  gallery !== undefined ?
                    <Gallery photos={gallery} />
                  :
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
            </Container>

            <Footer/>
        </div>
    )
}

export default Home_Gallery
