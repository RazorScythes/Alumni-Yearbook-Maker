import React, { useEffect, useState } from 'react';
import { Button, CloseButton, Row, Col, Form, Spinner} from 'react-bootstrap';
import { Paper } from '@material-ui/core';
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { uploadFileOnSection } from '../../actions/institute';
const UploadFileSection = props => {
    const dispatch = useDispatch()

    const inst = useSelector((state) => state.institute)
    
    /* DROPZONE */ 
    const [hidden, setHidden] = useState(false);

    const [dropfile, setDropfile] = useState({
        files: [],
    })
    const [postData, setPostData] = useState({
        selectedFile: []
    })
    const [image, setImage] = useState([])
    const [bulkSubmit, setBulkSubmit] = useState(0)

    useEffect(() => {
        if(inst.message){
            props.setShowDropzone(0)
        }
    }, [inst.message, inst])

    const {getRootProps, getInputProps, fileRejections, acceptedFiles, isDragActive} = useDropzone({
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
        if(dropfile.files.length > 0 && !bulkSubmit){
            let formData = new FormData()
            let details = {
                academic_year: props.academic_year,
                institute: props.institute,
                section: props.section
            }

            postData.selectedFile.map((file) => {
                formData.append("file", file)
            })

            Object.entries(details).map((keyName) => {
                formData.append(keyName[0], keyName[1])
            })

            dispatch(uploadFileOnSection(formData))
            setBulkSubmit(1)
        }
    }

    return (
        <> 
            <Button onClick={() => { props.setShowDropzone(false) }} variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
            <Paper elevation={2} style={{marginBottom:5, padding: 10}}>
                <div>
                    <CloseButton style={{float:"right"}} onClick={() => { 
                            props.setShowDropzone(false)
                        } 
                    }/>
                </div>
                <label className="display-icon"><i className="bx bx-file"></i><b> CSV / XLXS</b> file single upload</label>
                <br/>
                <Form style={{marginBottom:5}}>
                    <Row>
                        <Col xs={7}>
                            
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
                                    <p>Drag 'n' drop files here, or click to select files</p>
                                </div>

                        }
                </div>
                <div className="form">
                    <label style={{ color: "gray", fontSize:15 }}>Note: Please follow the format of the csv/xlxs provided on the toolbar</label>
                    <form onSubmit={submit} style={{float:"right"}}>
                            { hidden ? <Spinner animation="border" className="spinner" variant="primary" /> : null }
                            <Button type="submit" className="templateUpload" disabled={!dropfile.files.length} onClick={() => setHidden(true)} >Upload</Button>
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
        </>
    )
}

export default UploadFileSection
