import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getSectionCounts, checkSectionExists, createSection, uploadFile, deleteSection } from '../../actions/institute';
import { Button, Spinner } from 'react-bootstrap';
import { Link, useHistory  } from 'react-router-dom'
import { Paper } from '@material-ui/core';
import { Form, Row, Col, CloseButton, Alert, Modal, Tooltip, OverlayTrigger  } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone'

import file_format from '../../assets/downloadable/alumni_format.csv'

import { institute_list } from '../../assets/JsonData/institute'

import AddToolbar from "./CustomToolbar/AddToolbar";
import AddFileToolbar from "./CustomToolbar/AddFileToolbar";
import DownloadToolbar from './CustomToolbar/DownloadToolbar';

import TooltipHelper from '../TooltipHelper'
const Section = props => {
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    const inst = useSelector((state) => state.institute)
    const counts = useSelector((state) => state.institute.section_counts)
    const validate_section = useSelector((state) => state.institute.validate_section)

    const path = props.location.pathname.substring(0, props.location.pathname.lastIndexOf('/'))
    const active_route = institute_list.findIndex(item => path === item.route)

    const history = useHistory()
    const dispatch = useDispatch()

    const [uploadShow, setUploadShow] = useState(0)
    const [showDropzone, setShowDropzone] = useState(0)

    const [section, setSection] = useState('')
    const [program, setProgram] = useState('')
    const [required, setRequired] = useState(0)
    const [program_required, setProgramRequired] = useState(0)
    const [bulkSubmit, setBulkSubmit] = useState(0)
    const [deleteId, setDeleteId] = useState(0)
    
    /* DROPZONE */ 
    const [hidden, setHidden] = useState(false);

    const [dropfile, setDropfile] = useState({
        files: [],
    })
    const [postData, setPostData] = useState({
        selectedFile: []
    })
    const [image, setImage] = useState([])

    useEffect(() => {
        dispatch(getSectionCounts({
            academic_year: props.match.params.ay,
            institute: props.match.params.institute.toUpperCase()
        }))
    }, [props.match.params.ay, active_route, dispatch])

    useEffect(() => {
        if(inst.message){
            alertState(inst.message, inst.variant, inst.heading, inst.duplicate)
            setBulkSubmit(0)
            setHidden(0)
            setShowDropzone(0)
            setSection('')
            setProgram(counts ? counts.program[0] : [])
            setPostData({...postData, selectedFile: []})
            setDropfile({...dropfile, files: []})
            inst.message = '' //prevent infinite render
            inst.variant = '' //prevent infinite render
            inst.heading = '' //prevent infinite render
            inst.duplicate = '' //prevent infinite render
        }
    }, [inst.message, inst])

    const [alert, setAlert] = useState({
        message: '',
        box: false,
        variant: '',
        heading: '',
        duplicate: ''
    });
    
    const alertState = (m, v, h, d) => {
        setAlert({...alert, message: m, variant: v, heading: h, duplicate: d, box: true})
    }
    
    const alertBox = () => {
        return (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, box: false})} style={{padding:15}} dismissible>
                <Alert.Heading>{alert.heading}</Alert.Heading>
                <p>
                    { alert.message }
                </p>
                { alert.duplicate ? <span style={{color: "#d9534f"}}><b>Duplicate:</b> {alert.duplicate} data failed to upload because they are already existed.</span> : null }
            </Alert>
        );
    }

    const DeleteModals = props => {
        const inst_ = useSelector((state) => props.id ? state.institute.section_counts.section.find((p) => p._id === props.id) : null)

        const [show, setShow] = useState(true);
        const handleClose = () => {
            setShow(false)
            props.setDeleteId(false)
        };

        const handleDelete = () => {
            props.setDeleteId('')
            dispatch(deleteSection({
                id: props.id,
                academic_year: props.ay,
                institute: props.inst
            }))
        }

        return (
            <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Deleting Section <span style={{color: "red", fontWeight:500}}>{inst_.section}</span></p>
                    <p>Are you sure you want to delete this?</p>
                    <p style={{color: "red", fontWeight:500}}>
                        This will remove also the attached alumni.
                    </p>
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

    const goto = (e) => {
        history.push(`${props.location.pathname}/${counts.section[e.rowIndex].program} ${counts.section[e.rowIndex].section}`)
    }

    const delete_section = (e) => {
        setDeleteId(counts.section[e.rowIndex]._id)
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: "text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        multiple: false,
        onDrop: (acceptedFiles) => {    
            if (acceptedFiles.length > 0) {
                setPostData({...postData, selectedFile: acceptedFiles})
                setDropfile({...dropfile, files: acceptedFiles})
            }
            setImage(   
                acceptedFiles.map((upFile) => Object.assign(upFile, {
                    preview: URL.createObjectURL(upFile),
                    filename: upFile.name,
                    filesize: upFile.size
                }))
            )
        }
    })

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const remove = file => {
        dropfile.files.splice(file, 1);
        setPostData({...postData, selectedFile: dropfile.files})
    };

    const acceptedFilesItems = dropfile.files.map((upFile, index) => {
        return(
            <li key={index}><i className="bx bx-file"> </i><label><b>Filename: </b>{upFile.filename}<br/><b>Size: </b>{formatBytes(upFile.filesize)}</label><i className="bx delete bx-trash" onClick={() => remove(index)}></i></li>
        )
    })

    const submit = (e) => {
        e.preventDefault()

        // if(!section){
        //     setRequired(1)
        //     setHidden(0)
        // }
        if(validate_section)
            setHidden(0)
        else if(counts && counts.program.length == 0)
            setProgramRequired(1)    
        else if(!validate_section && dropfile.files.length > 0 && !bulkSubmit && counts && counts.program.length > 0){
            let formData = new FormData()
            let details = {
                academic_year: props.match.params.ay,
                institute: props.match.params.institute.toUpperCase(),
                section: section,
                program: program ? program : counts !== undefined && counts.program.length > 0 ? counts.program[0] : []
            }

            postData.selectedFile.map((file) => {
                formData.append("file", file)
            })

            Object.entries(details).map((keyName) => {
                formData.append(keyName[0], keyName[1])
            })

            dispatch(uploadFile(formData))
            setRequired(0)
            setBulkSubmit(1)
            setHidden(true)

            setSection('')
        }
    }

    const columns = [
        {
            name: "section",
            label: "Section",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "alumni",
            label: "Total Alumni",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "program",
            label: "Program",
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
                            <Button variant="warning" style={{fontSize:15}} onClick={() => goto(tableMeta)}><i className="bx bxs-user-detail"></i></Button>
                            { user?.result.role !== restricted_roles && <Button variant="danger" style={{fontSize:15, marginLeft:5}} onClick={() => delete_section(tableMeta)}><i className="bx bx-trash"></i></Button> }
                        </>
                    )
                }
            }
        },
    ];

    const handleToolbar1 = (e) => {
        setUploadShow(e)
        setShowDropzone(0)
        inst.validate_section = ''
        validateSection("")
    }

    const handleToolbar2 = (e) => {
        setShowDropzone(e)
        setUploadShow(0)
        inst.validate_section = ''
        validateSection("")
    }

    const options = {
        selectableRows: 'none', 
        filterType: 'checkbox',
        viewColumns: false,
        download:false,
        filter: false,
        print: false,
        responsive: "standard",
        customToolbar: () => {
            return (
                <>
                    {
                        user?.result.role !== restricted_roles &&
                        <>
                            <AddToolbar 
                                bool={handleToolbar1}
                            />
                            <AddFileToolbar 
                                bool={handleToolbar2}   
                            />
                        </>
                    }
                    <DownloadToolbar
                        link={file_format}
                    />
                </>
            );
          },
    };

    const validateSection = (e) => {
        if(!section)
            setRequired(0)
        setSection(e.toUpperCase())
        dispatch(checkSectionExists({
            academic_year: props.match.params.ay,
            institute: props.match.params.institute.toUpperCase(),
            section: e.toUpperCase(),
            program: program ? program : counts !== undefined && counts.program.length > 0 ? counts.program[0] : []
        }))
    }
 
    const validateProgram = (e) => {
        if(!section)
            setRequired(0)
        dispatch(checkSectionExists({
            academic_year: props.match.params.ay,
            institute: props.match.params.institute.toUpperCase(),
            section: section,
            program: e
        }))
    }

    const createSec = () => {
        // if(!section)
        //     setRequired(1)
        if(counts && counts.program.length == 0)
            setProgramRequired(1)    
        else if(!validate_section && counts && counts.program.length > 0){
            dispatch(createSection({
                academic_year: props.match.params.ay,
                institute: props.match.params.institute.toUpperCase(),
                section: section,
                program: program ? program : counts.program[0]
            }))
            
            if(!section) inst.validate_section = true

            setSection('')
            setRequired(0)
            setProgramRequired(0)
        }
    }

    const getProgram = counts ? counts.program.map((item) => {
        return(
            <option style={{textTransform:"uppercase"}} value={item}>{item}</option>
        )
    }) : null

    return (
        <div style={{padding:20}}>
            <Link to={`/admin/institute/${props.match.params.institute}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
            </Link>
            {
                deleteId ? 
                <DeleteModals
                    setDeleteId={setDeleteId}
                    id={deleteId}
                    ay={props.match.params.ay}
                    inst={props.match.params.institute.toUpperCase()}
                /> : null
            }
            {alert.box ? alertBox() : null}
            {
                uploadShow ?
                <Paper elevation={2} style={{marginBottom:5, padding: 10}}>
                    <div>
                        <CloseButton style={{float:"right"}} onClick={() => {
                                console.log(counts.program, counts.program[0])
                                setUploadShow(false)
                                setShowDropzone(false)
                                setSection('')
                                setProgram(counts.program.length > 0 ? counts.program[0] : [])
                            }
                        }/>
                        <h5>New Section</h5>
                        <hr style={{margin:5}}/>
                    </div>
                        <Row>
                            <Col>
                                <Col xs={12} style={{display: "flex"}}>
                                    <Form.Control value={section} placeholder="Section Name" name="section" onChange={(e) => validateSection(e.target.value)}/> 
                                    <TooltipHelper
                                        text={"Leave section name blank if the alumni lists doesn't specified any section."}                                
                                    />
                                </Col>
                                
                                { validate_section && <span style={{margin:"5px", color:"red", fontWeight:500}}>Section Name is already exists</span>}
                                { required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                            </Col>
                            <Col>
                                <Form.Select aria-label="Program"  onChange={(e) => {
                                    setProgram(e.target.value)
                                    validateProgram(e.target.value)
                                }}>
                                    {
                                        counts !== undefined && counts.program.length > 0 ?
                                            <>  
                                                <option disabled>Select Program...</option>
                                                {getProgram}
                                            </> :
                                            <option style={{textTransform:"uppercase"}} disabled>No Program Available</option>
                                    }
                                </Form.Select>
                                { program_required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button className="btn btn-dark" type="submit" style={{float:"right", margin:5 }} onClick={createSec} >Register</button>    
                            </Col>
                        </Row>
                </Paper> : null
            }
            {   
                showDropzone ? 
                <Paper elevation={2} style={{marginBottom:5, padding: 10}}>
                    <div>
                        <CloseButton style={{float:"right"}} onClick={() => { 
                                setUploadShow(false) 
                                setShowDropzone(false)
                                setSection('')
                                setProgram(counts.program.length > 0 ? counts.program[0] : [])
                            } 
                        }/>
                    </div>
                    <label class="display-icon"><i className="bx bx-file"></i><b> CSV / XLXS</b> file single upload</label>
                    <br/>
                    
                    <Form style={{marginBottom:20}}>
                        <Row>
                            <Col>
                                <Col xs={12} style={{display: "flex"}}>
                                    <Form.Control value={section} placeholder="Section Name" name="section" onChange={(e) => validateSection(e.target.value)}/> 
                                    <TooltipHelper
                                        text={"Leave section name blank if the alumni lists doesn't specified any section."}                                
                                    />
                                </Col>
                                { validate_section && <span style={{margin:"5px", color:"red", fontWeight:500}}>Section Name is already exists</span>}
                                { required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                            </Col>
                            <Col>
                                <Form.Select aria-label="Program" onChange={(e) => {
                                    setProgram(e.target.value)
                                    validateProgram(e.target.value)                                  
                                }}>
                                    {
                                        counts !== undefined && counts.program.length > 0 ?
                                            <>  
                                                <option disabled>Select Program...</option>
                                                {getProgram}
                                            </> :
                                            <option style={{textTransform:"uppercase"}} disabled>No Program Available</option>
                                    }
                                </Form.Select>
                                { program_required ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                            </Col>
                        </Row>
                    </Form>
                    <div className="dragzone" {...getRootProps()}>
                        <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    <div className="draglabel">
                                        <span><i className="bx bx-cloud-download"></i></span>
                                        <p>Drop the files here ...</p>
                                    </div> :
                                    <div className="draglabel">   
                                        <span><i className="bx bx-cloud-download"></i></span>
                                        <p>Drag 'n' drop image here, or click to select files</p>
                                    </div>

                            }
                    </div>
                    <div className="form">
                        <label style={{ color: "gray", fontSize:15 }}>Note: Please follow the format of the csv/xlxs provided on the toolbar</label>
                        <form onSubmit={submit} style={{float:"right"}}>
                                { hidden && !required ? <Spinner animation="border" className="spinner" variant="primary" /> : null }
                                <Button type="submit" className="templateUpload" disabled={!dropfile.files.length}>Upload</Button>
                        </form>
                    </div>
                    {
                        dropfile.files.length > 0 &&
                            <div className="subWrap">
                                <span>CSV/XLXS</span>
                                <div className="fileContainer">
                                    <ul>
                                        {acceptedFilesItems}
                                    </ul>
                                </div>
                                <p>{dropfile.files.length} file to be uploaded</p>
                            </div>
                    }
                </Paper> 
                :
                <MUIDataTable
                    title={`${counts ? counts.display_name : 'No Institute Found'} (${props.match.params.ay})`}
                    data={counts && counts.section}
                    columns={columns}
                    options={options}
                />
            }
        </div>
    )
}

export default Section
