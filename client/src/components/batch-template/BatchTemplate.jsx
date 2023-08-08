import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './styles.css'

import { Alert, Button, ButtonGroup, Card, DropdownButton, Dropdown, Modal } from 'react-bootstrap';
import GridImage from '../grid-image/GridImage';
import UploadModals from './UploadModals';
import ManageDesign from './ManageDesign'
import EditBatchTemplate from './EditBatchTemplate';
import { Link } from 'react-router-dom'
import moment from 'moment'

import { institute_list } from '../../assets/JsonData/institute'
import { uploadTemplate, uploadFrame, uploadBanner, uploadCover, uploadNametags, getBatchYear, deleteBatchYear } from '../../actions/batch-template'

require('dotenv').config()

const BatchTemplate = () => {
    const dispatch = useDispatch()

    const batch = useSelector((state) => state.batch)
    const batch_year = useSelector((state) => state.batch.batch_year)
    
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    useEffect(() => {
        dispatch(getBatchYear())
    }, [dispatch])

    useEffect(() => {
        if(batch.message){
            alertState(batch.message, batch.variant, batch.heading)
            batch.message = '' //prevent infinite render
            batch.variant = '' //prevent infinite render
            batch.heading = '' //prevent infinite render
        }
    }, [batch.message, batch])

    const [filter, setFilter] = useState('')

    const [alert, setAlert] = useState({
        message: '',
        box: false,
        variant: '',
        heading: ''
    });

    const [modal, setModal] = useState({
        templateModal: false,
        coverModal: false,
        nametagsModal: false,
        manageDesign: false,
        // frameModal: false,
        // bannerModal: false,
    })
    
    const [editId, setEditId] = useState(0)
    const [deleteId, setDeleteId] = useState(0)

    const remove = (id) => {
        setDeleteId(id)
    }

    const edit = (id) => {
        setEditId(id)
    }

    const cancelEdit = (id) => {
        setEditId(0)
    }

    const alertState = (m, v, h) => {
        setAlert({...alert, message: m, variant: v, heading: h, box: true})
    }

    const alertBox = () => {
        return (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, box: false})} style={{padding:15}} dismissible>
                <Alert.Heading>{alert.heading}</Alert.Heading>
                <p>
                    { alert.message }
                </p>
            </Alert>
        );
    }   

    const DeleteModals = props => {
        const batch = useSelector((state) => props.id ? state.batch.batch_year.find((p) => p._id === props.id) : null)

        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            props.setDeleteId(false)
            dispatch(deleteBatchYear(props.id))
        }

        return (
            <>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Deleting Batch Year <span style={{color: "red", fontWeight:500}}>{batch.academic_year}</span></p>
                    <p>Are you sure you want to delete this?</p>
                    <p style={{color: "red", fontWeight:500}}>
                        All related data will be also deleted including <br/>
                        - Yearbook <br/>
                        - Alumni Information <br/>
                        - Section/s <br/>
                        - Graduation Message <br/>
                        - Events <br/>
                        - Administrations <br/>
                        - Honor and Awardees <br/>
                        - Gallery
                    </p>
                    <p>This cannot be undone.</p>
                </Modal.Body>
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

    const BatchContainer = props => {
        const x = props.data
        //const data = x.filter(j => j.includes('x')).map((item, index) => {
        const data = x.filter(o =>
            Object.keys(o).some(k => o['academic_year'] !== null && o['academic_year'].toString().toLowerCase().includes(props.filter))).map((item, index) => {
                return (
                    <div className="template-container" key={index}>
                    <Card>
                        <Card.Header as="h6" style={{fontSize: "18px", color: "#000"}}>
                            <div style={{float:"left"}}>A.Y {item.academic_year}</div>
                            <DropdownButton 
                                variant={''}
                                id="dropdown-item-button" title="..."
                            >
                                <Dropdown.Item as="button" onClick={() => window.open(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN_NAME}:${process.env.REACT_APP_DATABASE_PORT}/admin/pdf/view/${item.academic_year}`,'_blank') } ><i className="bx bx-eye"></i> View Yearbook</Dropdown.Item>                             
                                {
                                    user?.result.role !== restricted_roles && 
                                    <>
                                        <Dropdown.Item as="button" onClick={() => edit(item._id)}><i className="bx bx-edit"></i> Edit</Dropdown.Item>
                                        <Dropdown.Item as="button" onClick={() => remove(item._id)}><i className="bx bx-trash"></i> Delete</Dropdown.Item>
                                    </>
                                }                     
                            </DropdownButton>
                        </Card.Header>
                        <Card.Body>
                            <Card style={{maxHeight: "185px", overflowY: "auto"}}>
                                <GridImage
                                    data={item}
                                />
                            </Card>
                            <Card.Title style={{margin:"5px 0"}}>{!item.multipage ? 'Single Page Design' : 'Multi Page Design'}</Card.Title>
                            <Card.Text style={{fontSize: "14px"}}>
                                This will be the final design template of all institutes yearbook
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer as="h6" style={{ textAlign:"right", fontSize: "13px", color: "#818181"}}>{moment(item.createdAt).fromNow()}</Card.Footer>
                    </Card>
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

    const handleModal1 = (e) => {
        setModal({...modal, templateModal: e})
    }

    // const handleModal2 = (e) => {
    //     console.log("frameModal",e)
    //     setModal({...modal, frameModal: e})
    // }

    // const handleModal3 = (e) => {
    //     console.log("bannerModal",e)
    //     setModal({...modal, bannerModal: e})
    // }

    const handleModal4 = (e) => {
        setModal({...modal, coverModal: e})
    }

    const handleModal5 = (e) => {
        setModal({...modal, nametagsModal: e})
    }

    const handleModal6 = (e) => {
        setModal({...modal, manageDesign: e})
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
                modal.templateModal ? 
                <UploadModals
                    label = "Template"
                    isOpen = {modal.templateModal}
                    bool = {handleModal1}
                    result = {alertState}
                    dispatch = {uploadTemplate}
                /> : null
            }
            {/* {
                modal.frameModal ? 
                <UploadModals
                    label = "Frame"
                    isOpen = {modal.frameModal}
                    bool = {handleModal2}
                    result = {alertState}
                    dispatch = {uploadFrame}
                /> : null
            }
            {
                modal.bannerModal ?
                <UploadModals
                    label = "Banner"
                    isOpen = {modal.bannerModal}
                    result = {alertState}
                    dispatch = {uploadBanner}
                    bool = {handleModal3}
                /> : null

            }            */}
            {
                modal.coverModal ? 
                <UploadModals
                    label = "Cover Page"
                    isOpen = {modal.coverModal}
                    result = {alertState}
                    dispatch = {uploadCover}
                    bool = {handleModal4}
                /> : null
            }  
            {
                modal.nametagsModal ?
                <UploadModals
                    label       = "Nametags"
                    isOpen      = {modal.nametagsModal}
                    result      = {alertState}
                    dispatch    = {uploadNametags}
                    bool = {handleModal5}
                /> : null
            }

            {
                modal.manageDesign ?
                <ManageDesign
                    label       = "Nametags"
                    isOpen      = {modal.manageDesign}
                    category    = {["Cover", "Template", "Nametag"]}
                    result      = {alertState}
                    dispatch    = {uploadNametags}
                    bool = {handleModal6}
                /> : null
            }   
            <div>
                <div className="search-box">
                    <input type="search" id="search" placeholder="Search Year" name="search" onChange={(e) => {setFilter(e.target.value); e.preventDefault()} } aria-label="Search"/>
                </div>
                {
                    editId ? <Button variant="primary" style={{borderRadius:0}} onClick={cancelEdit}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button> : null
                }
                
                {
                    user?.result.role !== restricted_roles &&
                        <Dropdown id="newTemplate"  as={ButtonGroup}>
                            <Link to="/admin/template/new" style={{ textDecoration: 'none' }}>
                                <Button variant="primary" style={{borderRadius:0}}>+ Year Design</Button>
                            </Link>

                            <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                            <Dropdown.Menu>
                                <Dropdown.Item variant="primary" onClick={() => setModal({...modal, templateModal: true})}> + New Template</Dropdown.Item>
                                {/* <Dropdown.Item                   onClick={() => setModal({...modal, frameModal: true})}> + New Frame</Dropdown.Item>
                                <Dropdown.Item                   onClick={() => setModal({...modal, bannerModal: true})}> + New Banner</Dropdown.Item> */}
                                <Dropdown.Item                   onClick={() => setModal({...modal, coverModal: true})}> + New CoverPage</Dropdown.Item>
                                <Dropdown.Item                   onClick={() => setModal({...modal, nametagsModal: true})}> + New Nametags</Dropdown.Item>
                                <Dropdown.Item                   onClick={() => setModal({...modal, manageDesign: true})}> Manage Designs</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                }
    
            </div>
            <hr className="hr"/>
            {
                !editId ? 
                    batch_year !== undefined &&
                        batch_year.length > 0 ?
                            <>
                                {alert.box ? alertBox() : null}
                                <BatchContainer
                                        data={batch_year}
                                        filter={filter ? filter : ''}
                                    /> 
                                </>
                            :  
                            alert.box ? 
                                alertBox() 
                                :
                                <Alert variant="danger">
                                    <Alert.Heading>No record found</Alert.Heading>
                                    <p className="mb-0">
                                        Click the <b>'Year Design'</b> button to add new or old Academic Year.
                                    </p>
                                </Alert> 
                    : 
                    <EditBatchTemplate
                        setEditId={setEditId}
                        id={editId}
                    />
                
            }
        </div>
    )
}

export default BatchTemplate
