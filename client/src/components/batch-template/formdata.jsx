import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'

import { uploadTemplate } from '../../actions/batch-template'
const formdata = () => {
    const batch = useSelector((state) => state.batch)
    const [show, setShow] = useState(false);
    const [hidden, setHidden] = useState(false);

    const handleClose = () => {
        setShow(false)
        props.onClick(false);
    };
    

    const [image, setImage] = useState([])
    const [postData, setPostData] = useState({
        selectedFile: []
    })

    const dispatch = useDispatch()

    const [dropfile, setDropfile] = useState({
        files: [],
    })
    
    const {getRootProps, getInputProps, fileRejections, acceptedFiles, isDragActive} = useDropzone({
        accept: "text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
    
    const remove = file => {
        dropfile.files.splice(file, 1);
        setPostData({...postData, selectedFile: dropfile.files})
    };

    useEffect(() => {
        setShow(props.isOpen)
        console.log(batch)
    }, [props.isOpen], batch.message);

    const submit = (e) => {
        e.preventDefault()

        if(dropfile.files.length > 0){
            let formData = new FormData()
            setPostData({...postData, selectedFile: acceptedFiles})
            formData.append("files",postData.selectedFile )

            postData.selectedFile.map((file, index) => {
                formData.append("images", file)
            })
            dispatch(uploadTemplate(formData))
        }
        else{
            console.log("not uploaded")
        }
        // dropfile.files = []
        // base64_image(dropfile.files)
        // handleClose()
        //console.log(props.test)
    }

    return (
        <>
            <Modal dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title"show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{ batch.success } New Upload</Modal.Title>
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
                                    <Button type="submit" className="templateUpload" disabled={!dropfile.files.length} onClick={() => setHidden(true)} >Upload</Button>
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
        </>
    )
}

export default formdata
