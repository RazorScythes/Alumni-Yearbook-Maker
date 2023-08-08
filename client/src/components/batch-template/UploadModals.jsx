import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'

const UploadModals = props => {
    const batch = useSelector((state) => state.batch)

    const [show, setShow] = useState(false);
    const [hidden, setHidden] = useState(false);

    const handleClose = () => {
        props.bool(false)
        setShow(false)
    };

    const [image, setImage] = useState([])
    const [postData, setPostData] = useState({
        selectedFile: []
    })
    const [submitted, setSubmitted] = useState(0)
    const dispatch = useDispatch()

    const [dropfile, setDropfile] = useState({
        files: [],
    })
    
    const {getRootProps, getInputProps, fileRejections, isDragActive} = useDropzone({
        accept: "image/*, .psd",
        multiple: true,
        onDrop: (acceptedFiles) => {    
            if (acceptedFiles.length > 0) {
                Promise.all(acceptedFiles.map(file => {
                    return (new Promise((resolve,reject) => {
                        const reader = new FileReader();
                        reader.addEventListener('load', (ev) => {
                            resolve(ev.target.result);
                        });
                        reader.addEventListener('error', reject);
                        reader.readAsDataURL(file);
                    }));
                }))
                .then(images => {
                    /* Once all promises are resolved, update state with image URI array */
                    // setPostData({...postData, selectedFile: postData.selectedFile.concat(images)})
                    setPostData({...postData, selectedFile: postData.selectedFile.concat(acceptedFiles)})
                    setDropfile({...dropfile, files: dropfile.files.concat(acceptedFiles)})
                }, error => {        
                    console.error(error);
                });
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

    const fileRejectionItems = fileRejections.map(({ file, errors } , index) => (
         <li key={index}><i className="bx bx-file"> </i><label><b>Filename: </b>{file.path}<br/><b>Size: </b>{formatBytes(file.size)}</label></li>
      ));
    

    const acceptedFilesItems = dropfile.files.map((upFile, index) => {
        return(
            <li key={index}><i className="bx bx-image"> </i><label><b>Filename: </b>{upFile.filename}<br/><b>Size: </b>{formatBytes(upFile.filesize)}</label><i className="bx delete bx-trash" onClick={() => remove(index)}></i></li>
        )
    })

    const base64_image = (file) => {   
            Promise.all(file.map(file => {
                return (new Promise((resolve,reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        resolve(ev.target.result);
                    });
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(file);
                }));
            }))
            .then(images => {
                /* Once all promises are resolved, update state with image URI array */
                setPostData({...postData, selectedFile: images})
            }, error => {        
                console.error(error);
            });
    }
    
    const remove = file => {
        dropfile.files.splice(file, 1);
        base64_image(dropfile.files)
    };

    useEffect(() => {
        setShow(props.isOpen)
        if(batch.message)
            successfulUpload(batch.message, batch.variant, batch.heading)
    }, [props.isOpen, batch.message]);

    const successfulUpload = (message, variant, heading) => {
        /*
            server side 
        */
        if(batch.message.includes(props.label)){
            dropfile.files = []
            base64_image(dropfile.files)

            setHidden(false) //hide spinner
            handleClose() //hide modals

            props.result(message, variant, heading);
            batch.message = '' //prevent infinite render
            batch.variant = '' //prevent infinite render
            batch.heading = '' //prevent infinite render

            setSubmitted(0)
        }
        else{
            setHidden(false) //hide spinner
            handleClose() //hide modals

            props.result(message, variant, heading);
            batch.message = '' //prevent infinite render
            batch.variant = '' //prevent infinite render
            batch.heading = '' //prevent infinite render

            setSubmitted(0)
        }
    }

    const submit = (e) => {
        e.preventDefault()
        if(dropfile.files.length > 0 && !submitted){
            let formData = new FormData()
            
            postData.selectedFile.map((file) => {
                formData.append("images", file)
            })
            dispatch(props.dispatch(formData))
        }
    }

    return (
        <>
            
            <Modal dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title"show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>New Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wrap-template">
                        <h4 style={{padding:5, fontWeight:"600"}}>Upload {props.label}</h4>
                        <hr style={{color: "#0A2558"}}/>
                        <label className="display-icon"><i className="bx bx-image"></i><b> Multiple / Single</b> image upload</label>
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
                            <form onSubmit={submit} style={{float:"right"}}>
                                    { hidden && <Spinner animation="border" className="spinner" variant="primary" /> }
                                    <Button type="submit" className="templateUpload"  onClick={() => setHidden(true)} disabled={!dropfile.files.length}>Upload</Button>
                            </form>
                        </div>
                        {
                            dropfile.files.length > 0 &&
                                <div className="subWrap">
                                    <span>Image/s</span>
                                    <div className="fileContainer">
                                        <ul>
                                            {acceptedFilesItems}
                                        </ul>
                                    </div>
                                    <p>{dropfile.files.length} image/s to be uploaded</p>
                                </div>
                        }
                        {
                            fileRejections.length > 0 &&
                            <div className="subWrap">
                                <span className="rejected">Rejected Files</span>
                                <div className="rejectfileContainer">
                                    <ul>
                                        {fileRejectionItems}
                                    </ul>
                                </div>
                            </div>
                        }
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

export default UploadModals
