import React, { useState } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import Slide from 'react-reveal/Slide';
const LongText = ({ content, limit}) => {
    const [showAll, setShowAll] = useState(false);
  
    const showMore = () => setShowAll(true);
    const showLess = () => setShowAll(false);
  
    if (content.length <= limit) {
      // there is nothing more to show
      return <div>{content}</div>
    }
    if (showAll) {
      // We show the extended text and a link to reduce it
      return <div> 
        {content} 
        <button onClick={showLess}>Read less</button> 
      </div>
    }
    // In the final case, we show a text with ellipsis and a `Read more` button
    const toShow = content.substring(0, limit) + "...";
    return <div> 
      {toShow} 
      {/* <button onClick={showMore}>Read more</button> */}
    </div>
}

const Events = ({data, page, itemPerPage}) => {
    const startIndex = (page - 1) * itemPerPage
    const selectedItem = data.slice(startIndex, startIndex + itemPerPage)

    const display = selectedItem.map((item, i) => {
        // console.log(item.desc.length)
        return (
            <Slide up>
            <div key={i} className="events_page_container">
                <div className="events_page_image">
                    <img src={item.image}/>
                </div>          
                <div className="events_page_content">
                    <h5>{item.header}</h5>
                    <span>Posted: {item.createdAt.split("T")[0]}</span>
                    <p><LongText content = {item.content} limit = {850} /> </p>
                    <a href={`/event/${item.header.replace(/ /g,"-")}_${item.academic_year.academic_year}`}>Read more <i style={{verticalAlign:"middle"}} className="bx bx-right-arrow-alt"></i></a>
                </div>                  
            </div>
            </Slide>
        )
    }) 
    return (
        <div>
            {
                selectedItem.length > 0 ? 
                    display :
                    <Alert variant="danger">
                        No events to show
                    </Alert>
            }
        </div>
    )
}

export default Events
