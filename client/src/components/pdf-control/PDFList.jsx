import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getPDFList, generateBatchYearbook, generateSectionYearbook, enableLink, disableLink, setActive, setInactive } from '../../actions/pdf-control';
import { Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'

import Done from "@material-ui/icons/Done";

import Tooltip from "@material-ui/core/Tooltip";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import UpdateIcon from '@material-ui/icons/Update';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import './styles.css'

const PDFList = props => {
    const pdf_list = useSelector((state) => state.pdfControl.files)
    const pdf = useSelector((state) => state.pdfControl)

    const dispatch = useDispatch()
    const history = useHistory()
    
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    useEffect(() => {
        dispatch(getPDFList({academic_year: props.match.params.ay}))
    }, [])

    useEffect(() => {
        if(pdf.message){
            alertState(pdf.message)
            pdf.message = '' //prevent infinite render

            setSubmitted(false)
            setTarget({...target,
                header: '',
                section: '',
                program: ''
            })
        }
    }, [pdf.message, pdf])

    const [alert, setAlert] = useState({
        message: '',
        box: false,
    });

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
    
    const [submitted, setSubmitted] = useState(false)
    const [target, setTarget] = useState({
        header: '',
        section: '',
        program: ''
    })

    const [showWarning, setShowWarning] = useState(0)
    const [data, setData] = useState('')
    const WarningModal = ({setShowWarning, data}) => {

        const [show, setShow] = useState(true);

        const handleClose = () => {
            setShowWarning(false)
            setShow(false);
        }

        const GeneratePDF = () => {
            if(!submitted){
                if(!data.section)
                    dispatch(generateBatchYearbook({id: data._id}))
                else
                    dispatch(generateSectionYearbook({id: data._id}))

                setShowWarning(false)
                setData('')
    
                setTarget({...target,
                    header: "Generating",
                    section: data.target,
                    program: data.program
                })
                setSubmitted(true)
            }
        }

        return (
            <>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Generate PDF</Modal.Title>
                </Modal.Header>
                <Modal.Body>There are still missing components of data required to fully make the yearbook. See below <br/> <span style={{color:"red", lineHeight:5}}>[{data.missing.join()}]</span> <br/> <span style={{fontWeight:600}}> Do you want still to continue make the yearbook? </span></Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={GeneratePDF}>
                    Generate
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }

    const handleMake = (e, update = false) => {
        if(update && !submitted){
            if(pdf_list[e.rowIndex].section)
                dispatch(generateSectionYearbook({id: pdf_list[e.rowIndex]._id}))
            else
                dispatch(generateBatchYearbook({id: pdf_list[e.rowIndex]._id}))

            setTarget({...target,
                header: "Updating",
                section: pdf_list[e.rowIndex].target,
                program: pdf_list[e.rowIndex].program
            })
            setSubmitted(true)
        }
        else if(!submitted){
            if(e.rowData[2].length > 0){
                setShowWarning(true)
                setData(pdf_list[e.rowIndex])
            }
            else{
                if(pdf_list[e.rowIndex].section)
                    dispatch(generateSectionYearbook({id: pdf_list[e.rowIndex]._id}))
                else
                    dispatch(generateBatchYearbook({id: pdf_list[e.rowIndex]._id}))

                setTarget({...target,
                    header: "Generating",
                    section: pdf_list[e.rowIndex].target,
                    program: pdf_list[e.rowIndex].program
                })
                setSubmitted(true)
            }
        }
    }

    const enable = (e) => {
        dispatch(enableLink({id: pdf_list[e]._id}))
    }

    const disable = (e) => {
        dispatch(disableLink({id: pdf_list[e]._id}))
    }

    const missingLink = (data) => data.map((item) => {
        return (
            // <p style={{fontWeight:600, padding:0, margin:0, color:"red"}}>[{item}]</p>
            <>
            {
                item === 'Section' || item === 'Alumni Data' ? 
                <a href="/admin/institute" style={{background:"red", borderRadius:10, padding:7, width:"auto", textAlign:"center", marginRight:5, textDecoration:"none"}}>
                    <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>{item}</p>
                </a> :
                item === 'Commence Message'  ? 
                <a href="/admin/commence" style={{background:"red", borderRadius:10, padding:7, width:"auto", textAlign:"center", marginRight:5, textDecoration:"none"}}>
                    <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>{item}</p>
                </a> :
                item === 'Events'  ? 
                <a href="/admin/news&events/events" style={{background:"red", borderRadius:10, padding:7, width:"auto", textAlign:"center", marginRight:5, textDecoration:"none"}}>
                    <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>{item}</p>
                </a> :
                item === 'Administrators'  ? 
                <a href="/admin/administration" style={{background:"red", borderRadius:10, padding:7, width:"auto", textAlign:"center", marginRight:5, textDecoration:"none"}}>
                    <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>{item}</p>
                </a> :
                item === 'Honors and Awards'  ? 
                <a href="/admin/honor&awards" style={{background:"red", borderRadius:10, padding:7, width:"auto", textAlign:"center", marginRight:5, textDecoration:"none"}}>
                    <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>{item}</p>
                </a> :
                item === 'Exercise Gallery'  ? 
                <a href="/admin/exercise-gallery" style={{background:"red", borderRadius:10, padding:7, width:"auto", textAlign:"center", marginRight:5, textDecoration:"none"}}>
                    <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>{item}</p>
                </a> : null
            }
            </>
            // <div style={{background:"red", borderRadius:10, padding:7, width:"auto", textAlign:"center", marginRight:5}}>
            //     <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>{item}</p>
            // </div>
        )
    })

    const columns = [
        {
            name: "target",
            label: "Target",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "program",
            label: "Program",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "missing",
            label: "Missing",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value.length > 0)
                    return (
                        <div style={{display:"inline-flex"}}>
                            {missingLink(value)}
                        </div>
                    );
                else
                  return (
                    <Tooltip title="Done">
                        <Done color="primary" />
                    </Tooltip>
                  );
              }
            }
        },
        {
            name: "file",
            label: "Output File",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(tableMeta.rowData[4] === "not created") {
                        return (
                            <div style={{background:"red", borderRadius:10, padding:7, maxWidth:"100px", textAlign:"center"}}>
                                <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>Not Created</p>
                            </div>
                        )
                    }
                    else {
                        return (
                            <a href={value.uri} download>{value.file_name}</a>
                        )
                    }
                }
            }
        },
        {
            name: "status",
            label: "Status",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value === "not created")
                  return (
                        <div style={{background:"red", borderRadius:10, padding:7, maxWidth:"100px", textAlign:"center"}}>
                            <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>Not Created</p>
                        </div>
                  );
                else if(value === "created")
                    return (
                        <div style={{background:"#006400", borderRadius:10, padding:7, maxWidth:"100px", textAlign:"center"}}>
                            <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>Created</p>
                        </div>
                    );
                else if(value === "active")
                    return (
                        <div style={{background:"#0275d8", borderRadius:10, padding:7, maxWidth:"100px", textAlign:"center"}}>
                            <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>Active</p>
                        </div>
                    );
                else if(value === "inactive")
                return (
                        <div style={{background:"#DAA520", borderRadius:10, padding:7, maxWidth:"100px", textAlign:"center"}}>
                            <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px black"}}>Inactive</p>
                        </div>
                );
                else
                  return (
                    <Tooltip title="Done">
                        <Done color="primary" />
                    </Tooltip>
                  );
              }
            }
        },
        {
            name: "action",
            label: "Action",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(user?.result.role !== restricted_roles){
                        if(tableMeta.rowData[4] === 'not created')
                            return (
                                <>  
                                    <Tooltip title="Generate PDF Yearbook">
                                            <NoteAddIcon style={{cursor:"pointer", fontSize:30, color:'#1976d2'}} onClick={() => handleMake(tableMeta)} />
                                    </Tooltip>
                                </>
                            );
                        else
                            if(tableMeta.rowData[4] === 'created')
                                return (
                                    <>  
                                        <Tooltip title="View PDF">
                                            <a download={false} href={pdf_list[tableMeta.rowIndex].uri} target='_blank' rel='noopener noreferrer'>
                                                <VisibilityIcon style={{cursor:"pointer", marginRight:10, fontSize:30, color:'#1976d2'}}/>
                                            </a>
                                            {/* //<Button variant="primary" style={{fontSize:15, }} onClick={() => console.log(tableMeta)}>Allow Link</Button> */}
                                        </Tooltip>
                                        <Tooltip title="Enable Download Link">
                                            <CloudDownloadIcon style={{cursor:"pointer", fontSize:30, color:'#1976d2'}} onClick={() => enable(tableMeta.rowIndex)} />
                                            {/* //<Button variant="primary" style={{fontSize:15, }} onClick={() => console.log(tableMeta)}>Allow Link</Button> */}
                                        </Tooltip>
                                        <Tooltip title="Update Content">
                                            <UpdateIcon style={{cursor:"pointer", fontSize:30, marginLeft:10, color:"#d32f2f"}} onClick={() => handleMake(tableMeta, true)} />
                                            {/* //<Button variant="primary" style={{fontSize:15, }} onClick={() => console.log(tableMeta)}>Allow Link</Button> */}
                                        </Tooltip>
                                        {/* <Button variant="primary" style={{fontSize:15, marginLeft:5}} onClick={() => console.log(tableMeta)}>Update</Button> */}
                                    </>
                                );
                            else if(tableMeta.rowData[4] === 'active')
                                return (
                                    <>  
                                        <Tooltip title="Remove Download Link">
                                            <RemoveCircleOutlineIcon style={{cursor:"pointer", fontSize:30, color:'#1976d2'}} onClick={() => disable(tableMeta.rowIndex)} />
                                        </Tooltip>
                                    </>
                                );
                            else if(tableMeta.rowData[4] === 'inactive')
                                return (
                                    <>  
                                        <Tooltip title="View PDF">
                                            <a download={false} href={pdf_list[tableMeta.rowIndex].uri} target='_blank' rel='noopener noreferrer'>
                                                <VisibilityIcon style={{cursor:"pointer", marginRight:10, fontSize:30, color:'#1976d2'}}/>
                                            </a>
                                        </Tooltip>
                                        <Tooltip title="Enable Download Link">
                                            <CloudDownloadIcon style={{cursor:"pointer", fontSize:30, color:'#1976d2'}} onClick={() => enable(tableMeta.rowIndex)} />
                                        </Tooltip>
                                        <Tooltip title="Update Content">
                                            <UpdateIcon style={{cursor:"pointer", fontSize:30, marginLeft:10, color:"#d32f2f"}} onClick={() => handleMake(tableMeta, true)} />                                       
                                        </Tooltip>
                                    </>
                                )
                    }
                    else
                        return(
                            <>
                            <Tooltip title="Restricted Actions">
                                <CloseIcon style={{fontSize:30, marginLeft:10, color:"#d32f2f"}}/>                                       
                            </Tooltip>
                            </>
                        )
                }   
            }
        },
    ];

    const options = {
        selectableRows: 'none', 
        filterType: 'checkbox',
        viewColumns: false,
        download: false,
        print: false,
        responsive: "standard",
    };

    const setAllActive = () => dispatch(setActive({academic_year: props.match.params.ay}))
    const setAllInactive = () => dispatch(setInactive({academic_year: props.match.params.ay}))

    return (
        <div style={{padding:20}}>
            {
                showWarning ? 
                <WarningModal
                    data={data}
                    setShowWarning={setShowWarning}
                    ay={props.match.params.ay}
                /> : null
            }
            {alert.box && !submitted ? alertBox() : null}
            {
                submitted ? 
                    <Alert variant="info">
                        <Alert.Heading>{target.header} Yearbook 
                            <Spinner animation="grow" size="sm" style={{width:5, height:5, marginBottom: 3, marginLeft:3}}/>
                            <Spinner animation="grow" size="sm" style={{width:5, height:5, marginBottom: 3, marginLeft:3}}/>
                            <Spinner animation="grow" size="sm" style={{width:5, height:5, marginBottom: 3, marginLeft:3}}/>
                        </Alert.Heading>
                        <p>
                            This will take more than a minute (depending on the number of image), Only one yearbook can be created at the time to prevent loss/altered of data in the proccess.
                            <br/> <span style={{fontWeight: 600}}>[target: {target.section} ({target.program})]</span>
                        </p>
                    </Alert>
                : null
            }
            {
                pdf_list ? 
                    user?.result.role !== restricted_roles && 
                        <section style={{display: "inline-block", width: "100%"}}>
                            <div style={{float: "right"}}>
                                <Button variant="primary" onClick={setAllActive}>Set Active</Button>{' '}
                                <Button variant="warning" onClick={setAllInactive} style={{ color:"white", textShadow:"5px 1px 5px gray"}}>Set Inactive</Button>{' '}
                            </div>
                        </section>
                : null
            }

            <MUIDataTable
                title={`A.Y ${props.match.params.ay} PDF FILES`}
                data={pdf_list && pdf_list}
                //data={testData}
                //columns={columns}
                columns={pdf_list && columns}
                options={options}
            />
        </div>
    )
}

export default PDFList
