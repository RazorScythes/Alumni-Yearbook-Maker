import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getAlumniList, deleteAlumni } from '../../actions/institute';
import { Button, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { institute_list } from '../../assets/JsonData/institute'
import NewAlumni from './NewAlumni';
import EditAlumni from './EditAlumni';
import AddAlumniToolbar from "./CustomToolbar/AddAlumniToolbar";

import file_format from '../../assets/downloadable/alumni_format.csv'
import DownloadToolbar from './CustomToolbar/DownloadToolbar';
import BurstToolbar from './CustomToolbar/BurstToolbar';
import AddFileToolbar from "./CustomToolbar/AddFileToolbar";

import ImageBurstDropzone from './ImageBurstDropzone';
import UploadFileSection from './UploadFileSection';

import Tooltip from "@material-ui/core/Tooltip";
import Done from "@material-ui/icons/Done";
import CloseIcon from '@material-ui/icons/Close';

const Alumni = props => {
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    const inst = useSelector((state) => state.institute)
    const alumni_list = useSelector((state) => state.institute.alumni_list)
    const path1 = props.location.pathname.substring(0, props.location.pathname.lastIndexOf('/'))
    const path2 = path1.substring(0, path1.lastIndexOf('/'))

    const active_route = institute_list.findIndex(item => path2 === item.route)

    const institute_acronym = props.match.params.institute.toUpperCase()

    const dispatch = useDispatch()

    useEffect(() => {
        if(inst.message){
            alertState(inst.message, inst.variant, inst.heading, inst.duplication)
            inst.message = '' //prevent infinite render
            inst.variant = '' //prevent infinite render
            inst.heading = '' //prevent infinite render
            inst.duplication = '' //prevent infinite render
        }
    }, [inst.message, inst])

    useEffect(() => {
        dispatch(getAlumniList({
            academic_year: props.match.params.ay,
            institute: institute_acronym,
            section: props.match.params.section
        }))
    }, [dispatch, props.match.params.ay, active_route])
    
    const [modalShow, setModalShow] = useState(0)

    const [alert, setAlert] = useState({
        message: '',
        box: false,
        variant: '',
        duplication: '',
        heading: ''
    });
    
    const alertState = (m, v, h, d) => {
        setAlert({...alert, message: m, variant: v, heading: h, duplication: d, box: true})
    }
    
    const alertBox = () => {
        return (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, box: false})} style={{padding:15}} dismissible>
                <Alert.Heading>{alert.heading}</Alert.Heading>
                    { alert.message } <br/>
                    { alert.duplication &&
                        !alert.duplication.includes("0") &&
                            <p style={{color:"red", fontWeight: 500}}>
                                { alert.duplication }
                            </p>                      
                    }
            </Alert>
        );
    }

    const [deleteId, setDeleteId] = useState(0)

    const delete_alumni = (e) => {
        setDeleteId(alumni_list.alumni[e.rowIndex]._id)
    }

    const DeleteModals = props => {
        const currentAlumni = useSelector((state) => props.id ? state.institute.alumni_list.alumni.find((p) => p._id === props.id) : null)
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            dispatch(deleteAlumni({
                id: currentAlumni._id,
                academic_year: props.ay,
                institute: institute_acronym,
                section: props.section
            }))
            props.setDeleteId(false)
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion {currentAlumni.student_number}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to continue?</Modal.Body>
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

    const [multiData, setData] = useState(null)

    const MultipleDelete = props => {
        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setData(null)
        };

        const handleDelete = () => {
            dispatch(deleteAlumni({
                data: props.data,
                academic_year: props.ay,
                institute: institute_acronym,
                section: props.section
            }))
            props.setData(null)
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete <span style={{color: "red", fontWeight:500}}>{props.data.length}</span> selected alumni?</Modal.Body>
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

    const UploadModals = props => {
        const [show, setShow] = useState(true);

        const handleClose = () => {
            setShow(false)
            props.setModalShow(false)
        };

        return (
            <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    I will not close if you click outside me. Don't even try to press
                    escape key.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Create</Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }

    const columns = [
        {
            name: "student_number",
            label: "Student Number",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "full_name",
            label: "Name",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "main",
            label: "Main Image",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value === 1)
                  return (
                    <Tooltip title="Uploaded">
                        <Done color="primary" />
                    </Tooltip>
                  );
                else
                    return (
                        <Tooltip title="Not Uploaded">
                            <CloseIcon color="error" />
                        </Tooltip>
                    );
              }
            }
        },
        {
            name: "sub",
            label: "Sub Image",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value === 1)
                  return (
                    <Tooltip title="Uploaded">
                        <Done color="primary" />
                    </Tooltip>
                  );
                else
                    return (
                        <Tooltip title="Not Uploaded">
                            <CloseIcon color="error" />
                        </Tooltip>
                    );
              }
            }
        },
        {
            name: "images",
            label: "Extra Images",
            options: {
                filter: true,
                sort: false,
            }
        },
            {
            name: "action",
            label: "Action",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>  
                            <Button variant="warning" style={{fontSize:15, marginRight:5}} onClick={() => editId(tableMeta)}><i className="bx bxs-edit"></i></Button>
                            { user?.result.role !== restricted_roles && <Button variant="danger" style={{fontSize:15}}  onClick={() => delete_alumni(tableMeta)}><i className="bx bx-trash"></i></Button> }
                        </>
                    )
                }
            }
        },
    ];

    const editId = (e) => {
        setId(alumni_list.alumni[e.rowIndex]._id)
        setEditAlumni(1)
    }


    const [showDropzone, setShowDropzone] = useState(0)
    const [showImageDropzone, setShowImageDropzone] = useState(0)

    const handleToolbar = (e) => {
        setShowDropzone(e)
        setShowImageDropzone(0)
    }

    const handleToolbar2 = (e) => {
        setShowImageDropzone(e)
        setShowDropzone(0)
    }

    const [newAlumni, setNewAlumni] = useState(0)
    const [editAlumni, setEditAlumni] = useState(0)
    const [id, setId] = useState('')
    const options = {
        // selectableRows: 'none', 
        filterType: 'checkbox',
        viewColumns: false,
        download: false,
        filter: false,
        print: false,
        responsive: "standard",
        customToolbar: () => {
            return (
                <>
                {
                    user?.result.role !== restricted_roles &&
                    <>
                        <AddAlumniToolbar 
                            bool={setNewAlumni}
                        />
                        <BurstToolbar
                            bool={handleToolbar2}   
                        />
                        <AddFileToolbar 
                            bool={handleToolbar}   
                        />
                    </>
                }
                
                <DownloadToolbar
                    link={file_format}
                />
                </>
            );
        },
        onRowsDelete:(e)=>{
            let arr = []
            e.data.forEach((item) => {
                arr.push(alumni_list.alumni[item.index])
            })
            setData(arr)
        }
    };

    return (
        <div style={{padding:20}}>     
            {
                deleteId ? 
                <DeleteModals
                    setDeleteId={setDeleteId}
                    id={deleteId}
                    ay={props.match.params.ay}
                    section={props.match.params.section}
                /> : null
            }   
            {
                multiData ? 
                <MultipleDelete
                    data={multiData}
                    setData={setData}
                    ay={props.match.params.ay}
                    section={props.match.params.section}
                /> : null
            }  
            {
                modalShow ? 
                <UploadModals
                    setModalShow={setModalShow}
                /> : null
            }
            {
                newAlumni ?
                    <NewAlumni
                        setNewAlumni={setNewAlumni}
                        academic_year={props.match.params.ay}
                        section={props.match.params.section}
                        institute={institute_acronym}
                    /> : null                 
            }
            {
                editAlumni ? 
                    <EditAlumni
                        id={alumni_list.alumni.find((p) => p._id === id)}
                        setEditAlumni={setEditAlumni}
                        academic_year={props.match.params.ay}
                        section={props.match.params.section}
                        institute={institute_acronym}
                    />  : null               
            }
            {
                showImageDropzone ?
                    <ImageBurstDropzone
                        setShowImageDropzone={setShowImageDropzone}
                        academic_year={props.match.params.ay}
                        section={props.match.params.section}
                        institute={institute_acronym}
                    /> : null
            }
            {
                showDropzone ? 
                    <UploadFileSection
                        setShowDropzone={setShowDropzone}
                        academic_year={props.match.params.ay}
                        section={props.match.params.section}
                        institute={institute_acronym}
                    /> : null
            }
            {
                !newAlumni && !editAlumni && !showDropzone && !showImageDropzone ? 
                    <>
                        <Link to={`/admin/institute/${props.match.params.institute}/${props.match.params.ay}`} style={{ textDecoration: 'none' }}>
                            <Button variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
                        </Link>
                        {alert.box ? alertBox() : null}
                        <MUIDataTable
                            title={`${alumni_list ? alumni_list.display_name : 'No institute Found'} (${props.match.params.section})`}
                            data={alumni_list && alumni_list.alumni}
                            columns={columns}
                            options={options}
                        />
                    </> : null
            }
        </div>
    )
}

export default Alumni
