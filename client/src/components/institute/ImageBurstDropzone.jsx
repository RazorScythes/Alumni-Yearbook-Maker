import React, { useEffect, useState } from 'react';
import { bulkImage } from '../../actions/institute';
import { Button, CloseButton, Row, Col, Form, Spinner, Card, Alert } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone'
import { Paper } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux'
const ImageBurstDropzone = props => {
    const inst = useSelector((state) => state.institute)

    const dispatch = useDispatch()

    /* DROPZONE */ 
    const [dropfile, setDropfile] = useState({
        image: [],
    })

    const [postData, setPostData] = useState({
        selectedImage: []
    })

    const [data, setData] = useState({
        type_: 'GRADUATION',
    })

    useEffect(() => {
        if(inst.message){
            props.setShowImageDropzone(0)
        }
    }, [inst.message, inst])

    const [submited, setSubmited] = useState(0)

    const [hidden, setHidden] = useState(false);

    const [image, setImage] = useState([])

    const [required, setRequired] = useState(0)

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: "image/*",
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
                    setPostData({...postData, selectedImage: postData.selectedImage.concat(acceptedFiles)})
                    setDropfile({...dropfile, image: dropfile.image.concat(acceptedFiles)})
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

    const remove = file => {
        dropfile.image.splice(file, 1);
        setPostData({...postData, selectedImage: dropfile.image})
    };
    
    const submit = (e) => {
        e.preventDefault()
        if(postData.selectedImage.length > 0 && !submited){
            let formData = new FormData()

            postData.selectedImage.map((file) => {
                formData.append("images", file)
            })
            formData.append("type_", data.type_)
            formData.append("params", props.academic_year)
            formData.append("params", props.section)
            formData.append("params", props.institute)
            setSubmited(1)
            dispatch(bulkImage(formData))
        }
    }

    const acceptedFilesItems = dropfile.image.map((upFile, index) => {
        return(
            <Card key={index} style={{width:150, border:"1px solid black", float:"left", marginRight:2, marginLeft:5, marginBottom: 10}}>
                <Card.Img variant="top" src={upFile.preview} style={{padding:5, width:150, height:180, objectFit:"contain", overflowX:"hidden"}}/>
                <Card.Body onClick={() => remove(index)} className="remove-img" style={{margin:0, padding:5, backgroundColor:"#0275d8"}}>
                    <Card.Text style={{color:"white", textAlign:"center", fontSize:13}}>
                        <i className="bx bx-trash"></i> Remove
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    })  

    const onChangeValue = (event) => {
        setData({...data, type_: event.target.value})
    }

    return (
        <> 
            <Button onClick={() => { props.setShowImageDropzone(false) }} variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
            {
                data.type_ === "GRADUATION" ?
                    <Alert variant="info" style={{padding:5}}>
                        <label style={{ color: "#292b2c", fontSize:14, width:"95%", padding:5 }}><b>Note:</b> When uploading graduation images, the filename must include their student number ex <b style={{color: "#FF0000"}}>"1819-1121 graduation_image.png"</b><br/><span style={{color: "#FF0000", fontWeight:500}}>Required</span>: Student number <br/><span style={{color: "#FF0000", fontWeight:500}}>Filename Format: </span>"student-number.png" or "student-number graduation_image.png" or "student-number_graduation_image.png"</label>
                    </Alert>
                    :
                    <Alert variant="info" style={{padding:5}}>
                        <label style={{ color: "#292b2c", fontSize:14, width:"95%", padding:5 }}><b>Note:</b> When uploading extra image/s shot, the filename must include their student number and image order e.x <b style={{color: "#d9534f"}}>"1819-1121 image_1.png"</b>. Image_1 will serve as the sub image for displaying on the yearbook (must be portrait) <br/><span style={{color: "#FF0000", fontWeight:500}}>Required</span>: Student number, Image order (image_x) <br/><span style={{color: "#FF0000", fontWeight:500}}>Filename Format: </span>"student-number image_1.png"</label>
                    </Alert>
            }
            
            <Paper elevation={2} style={{marginBottom:5, padding: 10}}>
                <div>
                    <CloseButton style={{float:"right"}} onClick={() => { 
                            props.setShowImageDropzone(false)
                        } 
                    }/>
                </div>
                <label className="display-icon"><i className="bx bx-image"></i><b> Multiple / Single </b> image upload</label>
                <br/>
                <Form>
                    <div className="mb-3">
                        <Form.Check
                            inline
                            checked={data.type_ === "GRADUATION"}
                            label="Graduation Image"
                            name="group1"
                            type="radio"
                            value = "GRADUATION"
                            onChange={onChangeValue}
                            id={`inline-radio-1`}
                        />
                        <Form.Check
                            inline
                            checked={data.type_ === "EXTRA"}
                            label="Extra Images"
                            name="group1"
                            type="radio"
                            value = "EXTRA"
                            onChange={onChangeValue}
                            id={`inline-radio-2`}
                        />
                    </div>
                </Form>
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
                                    <p>Drag 'n' drop image here, or click to select files</p>
                                </div>

                        }
                </div>
                <div className="form">
                    <label style={{ color: "gray", fontSize:15 }}>Info: Please follow the guide to prevent problems</label>
                    <form onSubmit={submit} style={{float:"right"}}>
                            { hidden && !required ? <Spinner animation="border" className="spinner" variant="primary" /> : null }
                            <Button type="submit" className="templateUpload" disabled={!dropfile.image.length} onClick={() => setHidden(true)} >Upload</Button>
                    </form>
                </div>
                {
                    dropfile.image.length > 0 &&
                        <div className="subWrap">
                            <span>IMAGE/s</span>
                            <div className="fileContainer">
                                <ul style={{display:"flex", flexWrap: 'wrap'}}>
                                    {acceptedFilesItems}
                                </ul>
                            </div>
                            <p>{dropfile.image.length} file to be uploaded</p>
                        </div>
                }
            </Paper> 
        </>
    )
}

export default ImageBurstDropzone
