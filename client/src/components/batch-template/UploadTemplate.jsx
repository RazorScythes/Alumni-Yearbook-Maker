import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Spinner, Modal, Button, ButtonGroup, Dropdown } from 'react-bootstrap';

const UploadTemplate = props => {
    const [show, setShow] = useState(false);
    const [hidden, setHidden] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [image, setImage] = useState([])
    const [postData, setPostData] = useState({
        selectedFile: []
    })

    const [dropfile, setDropfile] = useState({
        files: [],
    })
    
    const {getRootProps, getInputProps, fileRejections, isDragActive} = useDropzone({
        accept: "image/*",
        multiple: true,
        onDrop: (acceptedFiles) => {    
            if (acceptedFiles.length > 0) {
                //console.log(acceptedFiles)
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
                    setPostData({...postData, selectedFile: postData.selectedFile.concat(images)})
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

    const submit = (e) => {
        e.preventDefault()
        if(dropfile.files.length > 0)
            console.log("uploaded")
        else
            console.log("not uploaded")
        // dropfile.files = []
        // base64_image(dropfile.files)
        // handleClose()
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>

            <Modal dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title"show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>New Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wrap-template">
                        <h4 style={{padding:5, fontWeight:"600"}}>Upload Template</h4>
                        <hr style={{color: "#0A2558"}}/>
                        <label class="display-icon"><i className="bx bx-image"></i><b> Multiple / Single</b> image upload</label>
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
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        <div>
            <Dropdown id="newTemplate" as={ButtonGroup} style={{marginRight:50}}>
                <Button variant="primary">New Upload</Button>

                <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    <Dropdown.Item variant="primary"> + Template</Dropdown.Item>
                    <Dropdown.Item> + Banner</Dropdown.Item>
                    <Dropdown.Item> + Frame</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
        <hr className="hr"/>
        <div className="wrap-template">
            <h4 style={{padding:5, fontWeight:"600"}}>Upload Template</h4>
            <hr style={{color: "#0A2558"}}/>
            <label class="display-icon"><i className="bx bx-image"></i><b> Multiple / Single</b> image upload</label>
            <div className="dragzone" {...getRootProps()}>
                <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <div className="draglabel">
                                <p>Drop the files here ...</p>
                                <i className="bx bx-cloud-download"></i>
                            </div> :
                            <div className="draglabel">   
                                <span><i className="bx bx-cloud-download"></i></span>
                                <p>Drag 'n' drop image here, or click to select files</p>
                            </div>

                    }
            </div>
            <div className="form">
                <form onSubmit={submit}>
                        <Button type="submit" className="templateUpload" disabled={!dropfile.files.length}>Upload</Button>
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
        </>
    )
}

export default UploadTemplate
