import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getTemplate, getBanner, getFrame, getNametags, getCover, getCurrentYear, checkYear, uploadBatch } from '../../actions/batch-template'
import { useHistory } from 'react-router-dom'

import { Alert, FloatingLabel, Row, Col, Container, FormCheck, FormControl, FormLabel, Button, FormGroup, Modal } from 'react-bootstrap';
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

const SingleDesign = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const batch = useSelector((state) => state.batch)

    const templateList = useSelector((state) => state.batch.template)
    const coverList = useSelector((state) => state.batch.cover)
    const nametagsList = useSelector((state) => state.batch.nametags)
    // const bannerList = useSelector((state) => state.batch.banner)
    // const frameList = useSelector((state) => state.batch.frame)
    //console.log("Cover",coverList !== undefined , "Nametags",nametagsList)
    const currentYear = useSelector((state) => state.batch.year)
    const yearNow = `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`
    const validate_Year = useSelector((state) => state.batch.validate_year)

    useEffect(() => {
        dispatch(getCurrentYear())
        dispatch(getTemplate())
        dispatch(getBanner())
        dispatch(getFrame())
        dispatch(getNametags())
        dispatch(getCover())
    }, [dispatch])

    const [existing, setExisting] = useState(false)
    const [error, setError] = useState(null)
    const [acad, setAcad] = useState(0)
    const [submision, setSubmision] = useState(0)

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
        epilogue: '',
        acknowledgement: '',
        main_text_color: '',
        main_header_color: '',
        prayer: '',
        oath: '',
        pledge: '',
        display_count: 4,
        graduation_song: {
            song_title: '',
            singer: '',
            lyrics: ''
        },
        closing_song: {
            song_title: '',
            singer: '',
            lyrics: ''
        },
        // nametag_text_color: '',
        nametag_props: {},
        // banner_id: '',
        // frame_id: ''
    })
    
    useEffect(() => {
        if(batch.message)
            history.push('/admin/template')
        if(submision){
            dispatch(uploadBatch(form))
            setSubmision(false)
        }
    }, [form, submision, batch.message, dispatch, history])

    const [index, setIndex] = useState({
        template1: 0,
        template2: 0,
        template3: 0,
        template4: 0,
        cover: 0,
        nametags: 0,
        // banner: 0,
        // frame: 0,
    });

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

    if(currentYear != null)
            if(currentYear.academic_year === yearNow && !existing)
                setExisting(true)

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
          .min(15, 'Must be 15 characters or more')
          .required('Required'),
        vision: Yup.string()
          .min(15, 'Must be 15 characters or more')
          .required('Required'),
        goals: Yup.string()
            .min(10, 'Must be 10 characters or more'),
        core_values: Yup.string()
            .min(10, 'Must be 10 characters or more')
            .required('Required'),
        history: Yup.string()
            .min(50, 'Must be 50 characters or more')
            .required('Required'),
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

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const handleSubmit = async (e) => {
        if((templateList === undefined || templateList.length < 1) && (coverList === undefined || coverList.length < 1) && (nametagsList === undefined || nametagsList.length < 1)) return

        if(form.previous && !acad && validate_Year == null) {
            setError("Required")
            return
        }
        else setError(null)

        if(!dataUri){
            setRequire(true)
            return
        }

        let t = {
            template1: '',
            template2: '',
            template3: '',
            template4: '',
        }
        // let b , f
        let c , n , a
        
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

        if(!acad) a = yearNow
        else a = `${acad} - ${acad +1}`

        setForm(
            {
                ...form,
                academic_year: a,
                mision: e.mision,
                vision: e.vision,
                goals: e.goals,
                core_values: e.core_values,
                template_id: {...t},
                cover_id: c,
                nametags_id: n,
                history_image: dataUri,
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

        if(((!existing && !form.previous && !acad) || (form.previous && acad)) && validate_Year == null && !error)
            setSubmision(true)
        else
            console.log("form not fulfill requirements")
    }

    const validateYear = (e) => {
        if(e.target.value.match(/^-?\d+$/)){
            if(e.target.value.match(/^\d{4}$/)){
                if(parseInt(e.target.value) >= 2008 && parseInt(e.target.value) <= new Date().getFullYear() ){
                    setError(null)
                    const x = `${parseInt(e.target.value)} - ${parseInt(e.target.value)+1}`
                    dispatch(checkYear({academic_year: x}))
                    setAcad(parseInt(e.target.value))
                }
                else{
                    setError(`Year must be in between 2008 to ${new Date().getFullYear()}`)
                }
            }else{
                setError("Input must be exactly 4 digits")
            }
        }
        else{
            setError("Invalid Input must be digits")
        }
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
            {
                (templateList !== undefined && templateList.length < 1) || (coverList !== undefined && coverList.length < 1) || (nametagsList !== undefined && nametagsList.length < 1) ?
                <Alert variant="danger" style={{marginBottom:5}}>
                    <span><b>Resource Missing:</b> Please upload first all the required resources before you can create.<br/> 
                    <b>Missing:</b> {(coverList !== undefined && coverList.length < 1) ? 'Cover Page, ' : ''} {(templateList !== undefined && templateList.length < 1) ? 'Template, ' : ''} {(nametagsList !== undefined && nametagsList.length < 1) ? 'NameTags, ' : ''}</span>
                </Alert> : null
            }
            {
                !form.previous && existing ? 
                    <Alert variant="danger" style={{marginBottom:5}}>
                        <span><b>Warning:</b> Batch Year already created this year, if you want to add an old batch click the checkbox</span>
                    </Alert> : null
            }
            <div style={{marginBottom:10}}>
                <FormCheck 
                    type='checkbox'
                    id={`default-checkbox`}
                    label= "Previous Batch Year"
                    value="previous"
                    onChange={() => {
                        setForm({...form, previous: !form.previous})
                        setAcad(0) 
                    }}
                />
                {
                    form.previous &&
                        <FloatingLabel className="mb-3">
                            <FormControl
                                id="floatingInputCustom"
                                type="text"
                                placeholder="xxxx - xxxx"
                                name="academic_year"
                                onChange={(e) => {
                                    validateYear(e)
                                    
                                }}
                            />
                            <label htmlFor="floatingInputCustom">Academic Year ex. 2000</label>
                            {validate_Year && <span style={{margin:"5px", color:"red", fontWeight:500}}>Academic Year is already existing in this year!</span>}
                            {error && <span style={{margin:"5px", color:"red", fontWeight:500}}>{error}</span>}
                        </FloatingLabel>
                }
            </div>
            <Formik
                initialValues={{
                    mision: '',
                    vision: '',
                    goals: '',
                    core_values: '',
                    history: '',
                }}
                validationSchema={validate}
                setSy
                onSubmit={(values, actions) => {
                    handleSubmit(values)
                }}
                >
                {formik => (
                    <div>
                    <Form>
                        <Row style={{marginBottom:5}}>
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
                            <button className="btn btn-danger mt-3 ml-3" style={{float:"right"}} type="reset">Reset</button>
                            <button className="btn btn-dark mt-3" style={{float:"right", marginRight:10}} type="submit" disabled={(templateList !== undefined && templateList.length < 1) || (coverList !== undefined && coverList.length < 1) || (nametagsList !== undefined && nametagsList.length < 1)}>Register</button>
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
                                id="exampleColorInput"
                                defaultValue="#000000"
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
                                width="20rem"
                                height={155}
                                title="Nametag"
                                data={nametagsList}
                                setIndex={handleNameTags}
                                options={options}
                            /> : null
                    }
                    {/* {
                        frameList !== undefined && frameList.length > 0 ?
                            <>
                            <CardPicker 
                                width="16rem"
                                height={245}
                                title="Frame Design"
                                data={frameList}
                                setIndex={handleFrame}
                            />
                            </> : null
                    }
                    {
                        bannerList !== undefined && bannerList.length > 0 ?
                        <CardPicker 
                            width="20rem"
                            height={145}
                            title="Banner Design"
                            data={bannerList}
                            setIndex={handleBanner}
                        /> : null
                    } */}
                </div>
                </>
                : null
            }
        </>
    )
}

export default SingleDesign
