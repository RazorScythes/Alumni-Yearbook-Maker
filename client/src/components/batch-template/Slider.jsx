import React, { useState, useEffect } from 'react'
import { Carousel, Container, Col, Row,  Card, FormControl, FormCheck } from 'react-bootstrap';

// Example
/* <Slider
    label="&lt; Front Page &gt;"
    width={300}
    height={350}
    variant="dark"
    objectfit="fill"
    interval={null}
    index={index.template1}
    setIndex={handleTemplate1}
    data={templateList}
/> */
export const Slider = props => {
    const objectfit = props.objectfit
    const width = props.width
    const height = props.height
    const data = props.data
    const handleSelect = (selectedIndex, e) => {
        props.setIndex(selectedIndex)
    }

    const item = data.map((item, index) => {
        return (
            <Carousel.Item key={index} className="carousel__item">
                <img
                    style={{objectFit:objectfit, height: height}}
                    className="d-block w-100"
                    src={item.image}
                    alt="image"
                />
                <Carousel.Caption>
                    <h3>{item.h3}</h3>
                    <p>{item.p}</p>
                </Carousel.Caption>
            </Carousel.Item>
        )
    })

    return (
        <div>
            <span style={{width:"100%", textAlign:"center", fontWeight:600, fontSize:20}}>{props.label}</span>
            <Carousel style={{width: width, height: height}} variant={props.variant} interval={props.interval} activeIndex={props.index} onSelect={handleSelect} className="carousel">
                {item}
            </Carousel>
        </div>
    )
}

// Example
/* <CardPicker 
    width="16rem"
    height={245}
    title="Back Page"
    data={templateList}
    setIndex={handleTemplate5}
/> */
export const CardPicker = props => {    
    const data = props.data
    const width = props.width
    const height = props.height
    const [image, setImage] = useState(null)
    const [color, setColor] = useState("#FFFFFF") //default color value
    const [check, setCheck] = useState(true)
    const [options, setOptions] = useState(props.options ? props.options : '')

    const handleImage = (e) => {
        setImage(e.target.src)
        props.setIndex({
            index: e.target.id,
            options: options
        })
    }

    useEffect(() => {
        props.setIndex({options: options})
    }, [options])

    useEffect(() => {
        if(props.alt)
            setImage(props.alt)
        else
            setImage(data[0].image)
    }, [])

    const item = data.map((item, index) => {
        return (
            <Card.Img className="imgSelector" src={item.image} id={index} key={index} onClick={handleImage}/>
        )
    })

    return(
        <Card style={{ width: width, overflow:"hidden", marginRight:20, marginTop:10, display: "inline-block", verticalAlign: 'top'}}>
            <Card.Header style={{fontSize:18, fontWeight:500, color:"#000"}}>{props.title}</Card.Header>

            <div style={{position:"relative", textAlign:"center"}}>
                <Card.Img style={{ height: height, width:"100%", objectFit:"contain", padding:10, margin:0}} variant="top" src={image} />
                {
                    props.options ? 
                    <>
                        <label style={{color: options.color,  position: "absolute", bottom: options.name, left: "25%", tranform: "translate(-50%, -50%)", fontSize:17}}>Surname, First Name</label>

                        { options.checked ? <label style={{color: options.color, position: "absolute", bottom: options.quotes, left: "38%", tranform: "translate(-50%, -50%)", fontSize:12}}>"Quotes here"</label> : null }
                    </> : null
                }
            </div>

            <hr style={{margin:"0"}}/>
            <Card.Text style={{fontSize:14, fontWeight:600, margin:0, marginLeft:5}}>
                {props.type}
            </Card.Text>
            {
                props.options ? 
                <Card.Footer style={{ margin: 0, paddingTop: 5, marginBottom: 5, maxHeight:128, overflow:"scroll", padding:"0 5px"}}>
                    <Container>
                        <Row>
                            <Col>
                                <b>Text Color</b>
                                <FormControl
                                    type="color"
                                    id="exampleColorInput"
                                    value={options ? options.color : ''}
                                    defaultValue="#FFFFFF"
                                    title="Choose your color"
                                    onChange={(e) => setOptions({...options, color:e.target.value})}
                                />
                            </Col>
                            <Col>
                                <b> Show Quotes/ Motto </b>
                                <FormCheck
                                    style={{fontSize:20}}
                                    checked={options.checked}
                                    onClick={() => setOptions({...options, checked: !options.checked})}
                                />
                            </Col>
                        </Row>               
                    </Container>
                    <Container>
                        <Row>
                            <Col>
                                <b>Name Margin</b>
                                <FormControl
                                    type="number"
                                    id="exampleColorInput"
                                    defaultValue="#FFFFFF"
                                    title="Choose your color"
                                    onChange={(e) => setOptions({...options, name: parseInt(e.target.value)})} 
                                    value={options.name}
                                />
                            </Col>
                            <Col>
                                <b>Quotes Margin</b>
                                <FormControl
                                    type="number"
                                    id="exampleColorInput"
                                    defaultValue="#FFFFFF"
                                    title="Choose your color"
                                    onChange={(e) => setOptions({...options, quotes: parseInt(e.target.value)})} 
                                    value={options.quotes}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card.Footer> : null
            }
            <Card.Body style={{ margin:0, maxHeight:128, overflow:"scroll", padding:"0 15px"}}>
                <Container>
                    {item}
                </Container>
            </Card.Body>
        </Card>
    )
}