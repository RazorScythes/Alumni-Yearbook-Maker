import React,{ useState, useEffect } from 'react'
import { Alert, Form, Col, Row } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux';
import { getAllYear, getLatestGallery, getGallery, uploadOnDrop, removeImage } from '../../actions/gallery';
import { Link } from 'react-router-dom'
import template from '../../images/template2.jpg'
import main from '../../images/main.jpg'

import TooltipHelper from '../TooltipHelper'
import './styles.css'
const Gallery = () => {
    const dispatch = useDispatch()

    const academic_year = useSelector((state) => state.gallery.year)
    const gallery = useSelector((state) => state.gallery)
    const gallery_image = useSelector((state) => state.gallery.images)
    useEffect(() => {
        dispatch(getAllYear())
        dispatch(getLatestGallery())
    }, [dispatch])

    useEffect(() => {
        if(gallery.message){
            alertState(gallery.message, gallery.variant, gallery.heading)
            gallery.message = '' //prevent infinite render
            gallery.variant = '' //prevent infinite render
            gallery.heading = '' //prevent infinite render
        }
        else if(gallery_image)
            setAlert({...alert, box: false})
        // else
        //     setAlert({...alert, box: true})
    }, [gallery.message, gallery, gallery_image])
    
    /* DROPZONE */ 
    const [dropfile, setDropfile] = useState({
        image: [],
    })

    const [postData, setPostData] = useState({
        selectedImage: []
    })

    const [image, setImage] = useState([])

    const [id, setId] = useState('')

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
                    dispatch(uploadOnDrop({
                        id: id ? id : academic_year[0]._id,
                        images: images
                    }))
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

    const [alert, setAlert] = useState({
        message: '',
        box: false,
        variant: '',
        heading: ''
    });

    const alertState = (m, v, h) => {
        setAlert({...alert, message: m, variant: v, heading: h, box: true})
    }

    const alertBox = () => {
        return (
            <Alert variant={alert.variant} style={{margin: 0}}>
                { alert.message }
            </Alert>
        );
    }   
    
    const year_list = academic_year ? academic_year.map((item, i) => {
        return (
            <option value={item._id}>A.Y {item.academic_year}</option>
        )
    }) : null

    const grid_gallery = gallery_image ? gallery_image.map((item, i) => {
        return(
            <div className="gallery__container-box" key={i}>
                <img className="img-test" src={item.image}/>
                <button onClick={() => deleteImage(item._id)}>Delete</button>
            </div>
        )
    }) : null

    const deleteImage = (image) => {
        dispatch(removeImage({
            academic_year: id ? id : academic_year[0]._id,
            id: image
        }))
    }

    const getGalleryContent = (id) => {
        setId(id)
        dispatch(getGallery({id: id}))
    }

    return (
        <div className="wrap">
            {
                ( academic_year !== undefined && academic_year.length > 0 ) ?
                    year_list &&
                    <Row>
                    <Col style={{display:"flex", margin: "15px auto"}}>
                        <Form.Select 

                            onChange={(e) => getGalleryContent(e.target.value)}
                        >
                            {year_list}
                        </Form.Select>
                        <TooltipHelper
                            text={"Automatically uploaded when drop or selected. The image/s shows on the alumni gallery page"}                                
                        />
                    </Col>
                    <Col></Col>
                    </Row>
                : null
            }
            
            {
                academic_year !== undefined && academic_year.length > 0 ?
                    <>
                    <div className="dragzoneGallery" {...getRootProps()}>
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
                    {alert.box && alertBox()}
                    {
                        gallery_image !== undefined && gallery_image.length > 0 ? 
                            <>
                                <div className="gallery__wrap">
                                    <h3>{gallery_image.length} Image/s</h3>
                                    {grid_gallery}
                                </div>
                            </> : null
                    }
                    </> : 
                    alert.box ? alertBox() :
                    <Alert variant="warning">
                        No Academic Year Found. Make sure you create one first <Link to={"/admin/template/new"} style={{ textDecoration: 'none' }}> Click Here </Link>
                    </Alert>
            }
        </div>
    )
}

export default Gallery
