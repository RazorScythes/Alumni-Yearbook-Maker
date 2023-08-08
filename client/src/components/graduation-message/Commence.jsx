import React, { useState, useEffect } from 'react'
import './styles.scss'
import { DropdownButton, Dropdown, Button, ButtonGroup, Alert, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getCommenceData, deleteMessage } from '../../actions/commence'
import Forms from './Form'
const Commence = () => {
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    const commence_list = useSelector((state) => state.commence.message_list)
    const commence = useSelector((state) => state.commence)

    const [showform, setNew] = useState(false)
    const [editform, setEditForm] = useState(false)
    const [edit, setEdit] = useState('')

    const [filter, setFilter] = useState('')

    const [alert, setAlert] = useState({
        message: '',
        box: false,
    });

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCommenceData())
    }, [dispatch])

    useEffect(() => {
        if(commence.message){
            alertState(commence.message)
            commence.message = '' //prevent infinite render
        }
    }, [commence.message, commence])

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
        const id = useSelector((state) => props.id ? state.commence.message_list.find((p) => p._id === props.id) : null)
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            console.log(id._id)
            dispatch(deleteMessage({
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
                <Modal.Body>Are you sure you want to delete graduation message <span style={{color: "red", fontWeight:500}}>{id.name} ({id.position ? id.position.position : 'Position Already deleted'})</span> ?</Modal.Body>
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
                    <div className={ item.position === "Sumacunlaude" ||  item.position === "Cum Laude" ? "blog-card alt": "blog-card"}>
                        <DropdownButton 
                            variant={''}
                            id="dropdown-item-button2" title="..."
                        >
                            <Dropdown.Item as="button" onClick={() => {setEdit(item._id); setEditForm(true)}}><i className="bx bx-edit"></i> Edit</Dropdown.Item>
                            { user?.result.role !== restricted_roles && <Dropdown.Item as="button" onClick={() => setDeleteId(item._id)}><i className="bx bx-trash"></i> Delete</Dropdown.Item> }
                        </DropdownButton>
                        <div className="meta">
                            <div className="photo" style={{backgroundImage: `url(${item.image})`}}></div>
                            <ul className="details">
                                <li className="author">Academic Year: {item.academic_year ? item.academic_year.academic_year : 'deleted'}</li>
                                <li className="date">Created: {item.createdAt.split("T")[0]}</li>
                            </ul>
                        </div>
                        <div className="description">
                            <h1>{item.name}</h1>
                            <h2>{item.position ? item.position.position : "DELETED"}</h2>
                            <div className="text">
                                {item.quotes ? <span className="quotes">"{item.quotes}"</span> : null}               
                                <p className="content">{item.message}</p>      
                            </div>
                        </div>
                        { item.position !== "Sumacunlaude" ||  item.position !== "Cum Laude" ? 
                                <DropdownButton 
                                        variant={''}
                                        id="dropdown-item-button3" title="..."
                                >
                                    <Dropdown.Item as="button" onClick={() => {setEdit(item._id); setEditForm(true)}}><i className="bx bx-edit"></i> Edit</Dropdown.Item>
                                    { user?.result.role !== restricted_roles && <Dropdown.Item as="button" onClick={() => setDeleteId(item._id)}><i className="bx bx-trash"></i> Delete</Dropdown.Item> }
                                </DropdownButton> : null
                        }
                    </div>
                )
        })

        return (
            <>
                {data.length > 0 ? data : 
                    <Alert variant="danger">
                        No result found with search value
                    </Alert>
                }
            </>
        )
    }

    return (
        <div className="wrap">
            {
                !showform && !edit ? 
                    <>
                    <div>
                        <div className="search-box">
                            <input type="search" id="search" placeholder="Search Message" name="search" onChange={(e) => {setFilter(e.target.value); e.preventDefault()} } aria-label="Search"/>
                        </div>
                        
                        <Dropdown id="newTemplate"  as={ButtonGroup}>
                            { user?.result.role !== restricted_roles && <Button variant="outline-primary" onClick={() => setNew(true)}>Add New</Button> }
                        </Dropdown>
                    </div>
                    <hr className="hr"/>
                    {alert.box ? alertBox() : null}
                    </> : null
            }
            {
                deleteId ? 
                <DeleteModals
                    setDeleteId={setDeleteId}
                    id={deleteId}
                /> : null
            } 
            {
                showform || edit ? <Forms setNew={setNew} edit={edit} setEdit={setEdit} /> :  
                        commence_list !== undefined &&
                        commence_list.length > 0 ?
                            <CardContainer
                                data={commence_list}
                                filter={filter ? filter.toLowerCase() : ''}
                            /> : <Alert variant="danger">
                                    No Data Found in the database
                                </Alert>
            }
        </div>
    )
}

export default Commence
