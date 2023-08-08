import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Spinner, Modal, Button, Form, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { getCategoryType, removeDesign } from '../../actions/batch-template';

const ManageDesign = props => {
    const dispatch = useDispatch()

    const batch = useSelector((state) => state.batch)
    const category_list = useSelector((state) => state.batch.category)

    const [show, setShow] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [type, setType] = useState('')
    const handleClose = () => {
        props.bool(false)
        setShow(false)
    };

    useEffect(() => {
        if(props.category && props.category.length > 0){
            setType(props.category[0])
            dispatch(getCategoryType({type: props.category[0]}))
        }
    }, [dispatch]);

    useEffect(() => {
        setShow(props.isOpen)
    }, [props.isOpen, batch.message]);

    const category = props.category ? props.category.map((item, i) => {
        return(
            <option value={item}>{item}</option>
        )
    }) : null

    const getCategory = (e) => {
        setType(e.target.value)
        dispatch(getCategoryType({type: e.target.value}))
    }

    const remove = id => {
        dispatch(removeDesign({type: type, id: id}))
    };

    const list_items = category_list ? category_list.map((item, index) => {
        return(
            <Card key={index} style={{width:150, border:"1px solid black", float:"left", marginRight:2, marginLeft:5, marginBottom: 10}}>
                <Card.Img variant="top" src={item.image} style={{padding:5, width:150, height:180, objectFit:"contain", overflowX:"hidden"}}/>
                <Card.Body onClick={() => remove(item._id)} className="remove-img" style={{margin:0, padding:5, backgroundColor:"#0275d8"}}>
                    <Card.Text style={{color:"white", textAlign:"center", fontSize:13}}>
                        <i className="bx bx-trash"></i> Remove
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }) : null
    
    return (
        <>
            <Modal dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title"show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Manage Design</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Select aria-label="Default select example" style={{display:"block"}} onChange={getCategory}>
                        <option disabled={true}>Select Category</option>
                        {category}
                    </Form.Select>

                    <div className="subWrap" style={{marginTop:30}}>
                        <span>{category_list ? category_list.length : null} DESIGN/s</span>
                        <div className="fileContainer">
                            <ul style={{display:"flex", flexWrap: 'wrap'}}>
                                {list_items}
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ManageDesign
