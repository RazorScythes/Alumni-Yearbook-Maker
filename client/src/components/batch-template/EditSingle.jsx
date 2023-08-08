
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getTemplate, getNametags, getCover, getCurrentYear, editBatch } from '../../actions/batch-template'

import { Row, Col, Container, Alert, FormControl, FormLabel, Button, FormGroup, Modal, FormCheck } from 'react-bootstrap';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from "@material-ui/core/Tooltip";

import { CardPicker } from './Slider';
import './styles.css'
import 'react-image-picker/dist/index.css'

import { Formik, Form } from 'formik';
import { TextArea, NormalTextField } from './TextArea'
import * as Yup from 'yup';

import TooltipHelper from '../TooltipHelper'
const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
})

const options = {
    checked: true,
    color: "#FFFFFF",
    name: 57,
    quotes: 40,
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

const EditSingle = props => {
    const dispatch = useDispatch()

    const batch = useSelector((state) => state.batch)
    const templateList = useSelector((state) => state.batch.template)
    const coverList = useSelector((state) => state.batch.cover)
    const nametagsList = useSelector((state) => state.batch.nametags)

    // const bannerList = useSelector((state) => state.batch.banner)
    // const frameList = useSelector((state) => state.batch.frame)

    //set to empty json object if value is null
    if(!props.data.nametag_props) props.data.nametag_props = {}

    useEffect(() => {
        dispatch(getCurrentYear())
        dispatch(getTemplate())
        dispatch(getNametags())
        dispatch(getCover())
        // dispatch(getBanner())
        // dispatch(getFrame())
    }, [dispatch])

    const [submision, setSubmision] = useState(0)

    const [textArea, setTextArea] = useState({
        vision: props.data.mision ? props.data.mision : '',
        mision: props.data.vision ? props.data.vision : '',
        history: props.data.history_content ? props.data.history_content : '',
        prayer: props.data.prayer ? props.data.prayer : '',
        epilogue: props.data.epilogue ? props.data.epilogue : '',
        acknowledgement: props.data.acknowledgement ? props.data.acknowledgement : '',
        oath: props.data.oath ? props.data.oath : '',
        pledge: props.data.pledge ? props.data.pledge : '',
        g_song_title: props.data.graduation_song ? props.data.graduation_song.song_title : '',
        g_singer: props.data.graduation_song ? props.data.graduation_song.singer : '',
        g_lyrics: props.data.graduation_song ? props.data.graduation_song.lyrics : '',
        c_song_title: props.data.closing_song ? props.data.closing_song.song_title : '',
        c_singer: props.data.closing_song ? props.data.closing_song.singer : '',
        c_lyrics: props.data.closing_song ? props.data.closing_song.lyrics : '',
    })

    const [preview, setPreview] = useState(false)
    const [previewShow, setPreviewShow] = useState(false)
    const [dataUri, setDataUri] = useState('')
    const [require, setRequire] = useState(false)

    const onChange = (file) => {
        if(!file) {
          setDataUri('');
          return;
        }

        if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            return;
        }

        fileToDataUri(file)
          .then(dataUri => {
            setDataUri(dataUri)
            setRequire(false)
            setPreview(true)
          })
    }

    const [form, setForm] = useState({
        academic_year: '',
        multipage: false,
        previous: false,
        mision: '',
        vision: '',
        goals: '',
        core_values: '',
        template_id: '',
        cover: '',
        nametags: '',
        history_image: '',
        history_content: '',
        display_count: props.data.display_count ? props.data.display_count : 4,
        main_text_color: props.data.main_text_color ? props.data.main_text_color : '#000000',
        main_header_color: props.data.main_header_color ? props.data.main_header_color : '#000000',
        // nametag_text_color: props.data.nametag_text_color ? props.data.nametag_text_color : '#000000'
        nametag_props: !isEmpty(props.data.nametag_props) ? props.data.nametag_props : options
        // banner_id: '',
        // frame_id: ''
    })

    const [id, setId] = useState({
        template1: '',
        template2: '',
        template3: '',
        template4: '',
        cover: '',
        nametags: '',
        // banner: '',
        // frame: '',
    })

    const [index, setIndex] = useState({
        template1: 0,
        template2: 0,
        template3: 0,
        template4: 0,
        template5: 0,
        cover: 0,
        nametags: 0,
        // banner: 0,
        // frame: 0,
    });

    useEffect(() => {
        if(submision){
            console.log(form)
            props.setEditId(false)
            dispatch(editBatch(form, props.data._id))
            setSubmision(false)
        }
    }, [form, submision, batch.message, id, dispatch, props])

    const initData = () => {

        setTextArea({...textArea, 
            vision: props.data.vision,
            mision: props.data.mision,
            goals: props.data.goals,
            core_values: props.data.core_values,
            history: props.data.history_content,
            epilogue: props.data.epilogue,
            acknowledgement: props.data.acknowledgement,
            prayer: props.data.prayer,
            oath: props.data.oath,
            pledge: props.data.pledge,
            g_song_title: props.data.graduation_song.song_title ? props.data.graduation_song.song_title : '',
            g_singer: props.data.graduation_song.singer ? props.data.graduation_song.singer : '',
            g_lyrics: props.data.graduation_song.lyrics ? props.data.graduation_song.lyrics : '',
            c_song_title: props.data.closing_song.song_title ? props.data.closing_song.song_title : '',
            c_singer: props.data.closing_song.singer ? props.data.closing_song.singer : '',
            c_lyrics: props.data.closing_song.lyrics ? props.data.closing_song.lyrics : '',
        })

        setId({...id,
            template1: props.data.template_id.template1 !== null ? props.data.template_id.template1._id : '',
            template2: props.data.template_id.template2 !== null ? props.data.template_id.template2._id : '',
            template3: props.data.template_id.template3 !== null ? props.data.template_id.template3._id : '',
            template4: props.data.template_id.template4 !== null ? props.data.template_id.template4._id : '',
            cover: props.data.cover_id !== null ? props.data.cover_id : '',
            nametags: props.data.nametags_id !== null ? props.data.nametags_id : ''
            // banner: props.data.banner_id._id,
            // frame: props.data.frame_id._id
        })
    }

    useEffect(() => {
        initData()
    }, [])

    const handleTemplate1 = (e) => {
        if(e.index) {
            setIndex({...index, template1: e.index});
            setId({...id, template1: templateList[e.index]._id});
        }
    };
     
    const handleCover = (e) => {
        if(e.index) {
            setIndex({...index, cover: e.index});
            setId({...id, cover: coverList[e.index]._id});
        }
    };

    const handleNameTags = (e) => {
        if(e.index) {
            setIndex({...index, nametags: e.index});
            setId({...id, nametags: nametagsList[e.index]._id});
        }

        setForm({...form, nametag_props: e.options})
    };

    const handleTextColor1 = (hex) => {
        setForm({
            ...form,
            main_text_color: hex
        })
    }

    const handleTextColor2 = (hex) => {
        setForm({
            ...form,
            main_header_color: hex
        })
    }

    // const handleTextColor2 = (hex) => {
    //     setForm({
    //         ...form,
    //         nametag_text_color: hex
    //     })
    // }

    // const handleBanner = (e) => {
    //     setIndex({...index, banner: e});
    //     setId({...id, banner: bannerList[e]._id});
    // };

    // const handleFrame = (e) => {
    //     setIndex({...index, frame: e});
    //     setId({...id, frame: frameList[e]._id});
    // };

    const validate = Yup.object({
        mision: Yup.string()
          .min(15, 'Must be 15 characters or more'),
        vision: Yup.string()
          .min(15, 'Must be 15 characters or more'),
        goals: Yup.string()
          .min(15, 'Must be 10 characters or more'),
        core_values: Yup.string()
          .min(15, 'Must be 10 characters or more'),
        history: Yup.string()
          .min(50, 'Must be 50 characters or more'),
        prayer: Yup.string(),
        oath: Yup.string(),
        pledge: Yup.string(),
        epilogue: Yup.string(),
        acknowledgement: Yup.string(),
        g_song_title: Yup.string(),
        g_singer: Yup.string(),
        g_lyrics: Yup.string(),
        c_song_title: Yup.string(),
        c_singer: Yup.string(),
        c_lyrics: Yup.string(),
    })

    const handleSubmit = async (e) => {
        let t = {
            template1: '',
            template2: '',
            template3: '',
            template4: '',
        }
        // let b , f
        let c , n , a , v , m, g, cv
        a = props.data.academic_year

        /*   Template   */
        if(!id.template1){
            t.template1 = templateList[0]._id
            t.template2 = templateList[0]._id
            t.template3 = templateList[0]._id
            t.template4 = templateList[0]._id
        }
        else{
            t.template1 = id.template1
            t.template2 = id.template1
            t.template3 = id.template1
            t.template4 = id.template1
        }

        // /*   Frame   */
        // if(!id.frame) f = frameList[0]._id
        // else f = id.frame

        // /*   Banner   */
        // if(!id.banner) b = bannerList[0]._id
        // else b = id.banner

        /*   Page Cover   */
        if(!id.cover) c = coverList[0]._id
        else c = id.cover

        /*   Nametags   */
        if(!id.nametags) n = nametagsList[0]._id
        else n = id.nametags

        if(e.mision) m = e.mision
        else m = textArea.mision

        if(e.vision) v = e.vision
        else v = textArea.vision

        if(e.goals) g = e.goals
        else g = textArea.goals

        if(e.core_values) cv = e.core_values
        else cv = textArea.core_values

        setForm(
            {
                ...form,
                academic_year: a,
                mision: m,
                vision: v,
                goals: g,
                core_values: cv,
                template_id: {...t},
                cover_id: c,
                nametags_id: n,
                history_image: dataUri ? dataUri : '',
                history_content: e.history,
                epilogue: e.epilogue,
                acknowledgement: e.acknowledgement,
                main_text_color: form.main_text_color ? form.main_text_color : '#000000',
                main_header_color: form.main_header_color ? form.main_header_color : '#000000',
                prayer: e.prayer ? e.prayer : '',
                oath: e.oath ? e.oath : '',
                pledge: e.pledge ? e.pledge : '',
                display_count: form.display_count ? form.display_count : 4,
                graduation_song: {
                    song_title: e.g_song_title ? e.g_song_title : '',
                    singer: e.g_singer ? e.g_singer : '',
                    lyrics: e.g_lyrics ? e.g_lyrics : ''
                },
                closing_song: {
                    song_title: e.c_song_title ? e.c_song_title : '',
                    singer: e.c_singer ? e.c_singer : '',
                    lyrics: e.c_lyrics ? e.c_lyrics : ''
                },
                // nametag_text_color: form.nametag_text_color ? form.nametag_text_color : '#000000',
                nametag_props: !isEmpty(form.nametag_props) ? form.nametag_props : options
            })
    
        setSubmision(true)
    }

    const PreviewModal = () => {
        return(
            <Modal show={preview} onHide={setPreviewShow} animation={true}>
              <Modal.Header closeButton>
                <Modal.Title>Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{height:400, margin:"auto"}}>
                  <img src={dataUri} style={{maxHeight:"100%", width:"100%"}}/>   
              </Modal.Body>
            </Modal>
        )
    }

    return (
        <>     
            {previewShow ? <PreviewModal/> : null}
            <h3 style={{padding:5}}>Edit Academic Year</h3>
            {
                (templateList !== undefined && templateList.length < 1) || (coverList !== undefined && coverList.length < 1) || (nametagsList !== undefined && nametagsList.length < 1) ?
                <Alert variant="danger" style={{marginBottom:5}}>
                    <span><b>Resource Missing:</b> Please upload first all the required resources before you can update this academic year.<br/> 
                    <b>Missing:</b> {(coverList !== undefined && coverList.length < 1) ? 'Cover Page, ' : ''} {(templateList !== undefined && templateList.length < 1) ? 'Template, ' : ''} {(nametagsList !== undefined && nametagsList.length < 1) ? 'NameTags, ' : ''}</span>
                </Alert> : null
            }
            <Formik
                initialValues={{
                    mision: '',
                    vision: '',
                    goals: '',
                    core_values: '',
                    history: '',
                }}
                enableReinitialize={true} 
                initialValues={textArea}
                validationSchema={validate}
                setSy
                onSubmit={(values, actions) => {
                    handleSubmit(values)
                }}
                >
                {formik => (
                    <div>
                    <Form>
                    <Row style={{marginBottom: 5}}>
                            <Col xs={6}>
                                <TextArea
                                    text ="Mision"
                                    name="mision"
                                    maxLength={300}
                                />
                            </Col>
                            <Col xs={6}>
                                <TextArea
                                    text="Vision"
                                    name="vision"
                                    maxLength={300}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <TextArea
                                    text ="Goals"
                                    name="goals"
                                    maxLength={300}
                                />
                            </Col>
                            <Col xs={6}>
                                <TextArea
                                    text="Core Values"
                                    name="core_values"
                                    maxLength={300}
                                />
                            </Col>
                        </Row>
                        <hr/>

                        <Row style={{margin: "10px 0"}}><h3>Epilogue</h3></Row>
                        <Row style={{marginTop:10}}>
                            <Col>
                                <TextArea
                                    text=""
                                    name="epilogue"
                                    maxLength={1500}
                                />
                            </Col>
                        </Row>
                        <hr/>

                        <Row style={{margin: "10px 0"}}><h3>History</h3></Row>
                        <Row style={{marginTop:10}}>
                          <Col>                          
                              <FormGroup controlId="formFileSm" className="mb-3">
                                  <FormControl type="file" accept="image/*" onChange={(event) => onChange(event.target.files[0] || null)}/>
                                  { require ? <span style={{margin:"5px", color:"red", fontWeight:500}}>Required</span> : null } 
                              </FormGroup>
                          </Col>
                          <Col>
                            { preview ? 
                              <Tooltip title={"Preview"}>
                                <Button variant="primary" style={{fontSize:15}} onClick={() => setPreviewShow(true)}><VisibilityIcon /></Button>
                              </Tooltip>: null}                 
                          </Col>
                        </Row>
                        <Row>
                            <Col>
                                <TextArea
                                    text="History Content"
                                    name="history"
                                    maxLength={5000}
                                />
                            </Col>
                        </Row>
                        <hr/>
                        <Row style={{margin: "10px 0"}}><h3>Yearbook Back Page</h3></Row>
                        <Row style={{marginBottom:10}}>
                            <Col xs={6}>
                                <TextArea
                                    text ="Prayers of the Graduates"
                                    name="prayer"
                                    maxLength={750}
                                />
                            </Col>
                            <Col xs={6}>
                                <TextArea
                                    text="Oath of the Alumni"
                                    name="oath"
                                    maxLength={750}
                                />
                            </Col>
                        </Row>
                        
                        <Row style={{marginBottom:10}}>
                            <Col xs={6}>
                                <TextArea
                                    text ="Pledge of Loyalty"
                                    name="pledge"
                                    maxLength={750}
                                />
                            </Col>
                            <Col xs={6}>
                                <TextArea
                                    text ="Acknowledgement"
                                    name="acknowledgement"
                                    maxLength={750}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Col>
                                    <TooltipHelper
                                        text={"Keep the lyrics broad so that it will perfectly fit in half of page"}                                
                                    />
                                    <FormLabel>Graduation Song</FormLabel>
                                </Col>
                                
                                <Col>
                                    <NormalTextField
                                        text = "Song Title"
                                        name="g_song_title"
                                    />
                                    <NormalTextField
                                        text = "Singer"
                                        name="g_singer"
                                    />
                                </Col>
                                <TextArea
                                    text="Lyrics"
                                    name="g_lyrics"
                                    maxLength={1250}
                                />
                            </Col>
                            <Col xs={6}>
                                <Col>
                                    <TooltipHelper
                                        text={"Keep the lyrics broad so that it will perfectly fit in page"}                                
                                    />
                                    <FormLabel>Closing Song</FormLabel>
                                </Col>
                                
                                <Col>
                                    <NormalTextField
                                        text = "Song Title"
                                        name="c_song_title"
                                    />
                                    <NormalTextField
                                        text = "Singer"
                                        name="c_singer"
                                    />
                                </Col>
                                <TextArea
                                    text="Lyrics"
                                    name="c_lyrics"
                                    maxLength={2000}
                                />
                            </Col>
                        </Row>
                        <div style={{width:"100%", display:"inline-block"}}>
                            <button className="btn btn-dark mt-3" style={{float:"right", marginRight:10}} type="submit" disabled={(templateList !== undefined && templateList.length < 1) || (coverList !== undefined && coverList.length < 1) || (nametagsList !== undefined && nametagsList.length < 1)}>Save Changes</button>
                        </div>
                    </Form>
                    </div>
                )}
            </Formik>

            <hr/>

            {
                (templateList !== undefined && templateList.length > 0) && (coverList !== undefined && coverList.length > 0) && (nametagsList !== undefined && nametagsList.length > 0) ?
                <>
                    <Container fluid>
                        <Row>
                            <Col><h3>Alumni display per page</h3></Col>
                        </Row>
                    </Container> 

                    <Container>
                        <Row>
                            <div className="mb-3">
                                <FormCheck
                                    inline
                                    checked={form.display_count === 4}
                                    label="4x4 Display"
                                    name="group2"
                                    type="radio"
                                    value = {4}
                                    onChange={(e) => setForm({...form, display_count: parseInt(e.target.value)})}
                                    id={`inline-radio-3`}
                                />
                                <FormCheck
                                    inline
                                    label="3x3 Display"
                                    checked={form.display_count === 3}
                                    name="group2"
                                    type="radio"
                                    value = {3}
                                    onChange={(e) => setForm({...form, display_count: parseInt(e.target.value)})}
                                    id={`inline-radio-4`}
                                />
                            </div>
                        </Row>
                    </Container>
                    <hr/>

                    <Container fluid>
                        <Row>
                            <Col><h3>Text Color</h3></Col>
                        </Row>
                    </Container> 

                    <Container>
                        <Row>
                            <Col>
                                <div style={{display:"flex", flexWrap:"wrap"}}>
                                    <div style={{margin:"0 10px"}}>
                                        <FormLabel htmlFor="exampleColorInput">Page Text</FormLabel>
                                        <FormControl
                                            style={{width: 50}}
                                            type="color"
                                            value={form.main_text_color}
                                            id="exampleColorInput"
                                            defaultValue="#000000"
                                            title="Choose your color"
                                            onChange={(e) => handleTextColor1(e.target.value)}
                                        /> 
                                    </div>
                                    <div style={{margin:"0 10px"}}>
                                        <FormLabel htmlFor="exampleColorInput">Page Header</FormLabel>
                                        <FormControl
                                            style={{width: 50}}
                                            type="color"
                                            value={form.main_header_color}
                                            id="exampleColorInput"
                                            defaultValue="#000000"
                                            title="Choose your color"
                                            onChange={(e) => handleTextColor2(e.target.value)}
                                        /> 
                                    </div>
                                </div>
                            </Col>
                            {/* <Col xs={2}>
                                <FormLabel htmlFor="exampleColorInput">Nametag</FormLabel>
                                <FormControl
                                    type="color"
                                    value={form.nametag_text_color}
                                    id="exampleColorInput"
                                    title="Choose your color"
                                    onChange={(e) => handleTextColor2(e.target.value)}
                                />
                            </Col> */}
                        </Row>
                    </Container>

                    <hr/>

                    <Container fluid>
                        <Row>
                            <Col><h3>Select Design</h3></Col>
                        </Row>
                    </Container> 
                    <div className="flexbox-2 mb-5">
                        {
                            coverList !== undefined && coverList.length > 0 ?
                                <CardPicker 
                                    alt={props.data.cover_id !== null ? props.data.cover_id.image : ''}
                                    width="16rem"
                                    height={245}
                                    title="Cover Page"
                                    data={coverList}
                                    setIndex={handleCover}
                                /> : null
                        }
                        {
                            templateList !== undefined && templateList.length > 0 ?
                                <CardPicker 
                                    alt={props.data.template_id.template1 !== null ? props.data.template_id.template1.image : ''}
                                    width="16rem"
                                    height={245}
                                    title="Main Template"
                                    data={templateList}
                                    setIndex={handleTemplate1}
                                /> : null
                        }
                        {
                            nametagsList !== undefined && nametagsList.length > 0 ?
                                <CardPicker 
                                    alt={props.data.nametags_id ? props.data.nametags_id.image : ''}
                                    width="20rem"
                                    height={155}
                                    title="Nametag"
                                    data={nametagsList}
                                    setIndex={handleNameTags}             
                                    options={form.nametag_props}                      
                                /> : null
                        }
                        {/* {
                            frameList !== undefined &&
                            <>
                            <CardPicker 
                                alt={props.data.frame_id.image}
                                width="16rem"
                                height={245}
                                title="Frame Design"
                                data={frameList}
                                setIndex={handleFrame}
                            />
                            </>
                        }
                        {
                            bannerList !== undefined &&
                            <CardPicker 
                                alt={props.data.banner_id.image}
                                width="20rem"
                                height={145}
                                title="Banner Design"
                                data={bannerList}
                                setIndex={handleBanner}
                            />
                        } */}
                    </div>
                </> : null
            }
        </>
    )
}

export default EditSingle
