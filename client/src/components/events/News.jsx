import React, { useState, useEffect } from 'react'
import { Dropdown, DropdownButton, Button, ButtonGroup, Alert, Modal, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getNews, deleteNews } from '../../actions/events'
import moment from 'moment'
import { NewsForms } from './Form'
import './styles.css'
const News = () => {
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    const news_list = useSelector((state) => state.events.news_list)
    const events = useSelector((state) => state.events)

    const [showform, setNew] = useState(false)
    const [edit, setEdit] = useState('')
    const [editform, setEditForm] = useState(false)
    const [filter, setFilter] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getNews())
    }, [dispatch])

    const [alert, setAlert] = useState({
        message: '',
        box: false,
    });

    useEffect(() => {
        if(events.message){
            alertState(events.message)
            events.message = '' //prevent infinite render
        }
    }, [events.message, events])

    const alertState = (m) => {
        setAlert({...alert, message: m, box: true})
    }

    const alertBox = () => {
        return (
            <Alert variant="success">
                {alert.message}
            </Alert>
        );
    }   

    const [deleteId, setDeleteId] = useState(0)

    const DeleteModals = props => {
        const id = useSelector((state) => props.id ? state.events.news_list.find((p) => p._id === props.id) : null)
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            dispatch(deleteNews({
                id: id._id,
            }))
            props.setDeleteId(false)
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete news<span style={{color: "red", fontWeight:500}}>{id.header}</span> ?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }

    const CardContainer = props => {
        const x = props.data

        const data = x.filter(o =>
            Object.keys(o).some(k => o[k].toString().toLowerCase().includes(props.filter))).map((item, index) => {
                return (
                    <div class="col-xs-12 col-sm-6">
                        <DropdownButton 
                            variant={''}
                            id="dropdown-item-button2" title="..."
                        >
                            <Dropdown.Item as="button" onClick={() => {setEdit(item._id); setEditForm(true)}}><i className="bx bx-edit"></i> Edit</Dropdown.Item>
                            { user?.result.role !== restricted_roles && <Dropdown.Item as="button" onClick={() => setDeleteId(item._id)}><i className="bx bx-trash"></i> Delete</Dropdown.Item> }
                        </DropdownButton>
                        <div class="card-news-container">
                            <span class="img-news-card">
                                <img src={item.image} />
                            </span>
                            <div class="card-news-content">
                                <h4 class="card-news-title-heading">
                                    <span> {item.header}</span><br/>
                                    <span className="card-date">{item.createdAt.split("T")[0]}</span>
                                </h4>
                                <div className="card-news-text">
                                
                                        {item.content}
                                
                                </div>
                            </div>
                            <div class="card-read-more">
                                <Card.Footer as="h6" style={{ textAlign:"right", fontSize: "13px", color: "#818181"}}>{moment(item.createdAt).fromNow()}</Card.Footer>
                            </div>
                        </div>
                    </div>  
                )
        })

        return (
            <>
                {data.length > 0 ? data : 
                    <Alert variant="danger">
                        No result found with the search value
                    </Alert>
                }
            </>
        )
    }
    
    return (
        <div className="wrap">
            {
                deleteId ? 
                <DeleteModals
                    setDeleteId={setDeleteId}
                    id={deleteId}
                /> : null
            } 
            {
                showform || edit ?
                <NewsForms
                    setNew={setNew}
                    edit={edit} 
                    setEdit={setEdit}
                /> : 
                <>
                <div>
                    <div className="search-box">
                        <input type="search" id="search" placeholder="Search Header" name="search"  aria-label="Search" onChange={(e) => {setFilter(e.target.value); e.preventDefault()} }/>
                    </div>
                    
                    <Dropdown id="newTemplate"  as={ButtonGroup}>
                        { user?.result.role !== restricted_roles && <Button variant="outline-primary"  onClick={() => setNew(true)}>Add New</Button> }
                    </Dropdown>
                </div>
                <hr className="hr"/>
                {alert.box ? alertBox() : null}
                {
                    news_list !== undefined &&
                    news_list.length > 0 ?
                    <section class="wrapper-e-n">
                        <div class="container-fostrap">
                            <div>
                                <h1 class="heading">
                                    News and Updates
                                </h1>
                            </div>
                            <div class="content">
                                <div class="container">
                                    <div class="row">
                                        <CardContainer
                                            data={news_list}
                                            filter={filter ? filter.toLowerCase() : ''}
                                        />                   
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section> : 
                    <Alert variant="danger" style={{justifyContent:"left"}}>
                        No Data Found in the database
                    </Alert>
                }
                </>
            }
        </div>
    )
}

export default News
