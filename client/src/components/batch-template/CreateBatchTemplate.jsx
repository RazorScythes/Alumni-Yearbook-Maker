import React, { useState } from 'react'
import './styles.css'
import { uploadTemplate, uploadFrame, uploadBanner, uploadCover, uploadNametags } from '../../actions/batch-template'
import { Alert, Button, ButtonGroup, Dropdown, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import UploadModals from './UploadModals';
import ManageDesign from './ManageDesign'

import MultiDesign from './MultiDesign';
import SingleDesign from './SingleDesign';
const CreateBatchTemplate = () => {
    const [data, setData] = useState({
        design: 'single'
    })

    const [alert, setAlert] = useState({
        message: '',
        box: false,
        variant: '',
        heading: ''
    });

    const [modal, setModal] = useState({
        templateModal: false,
        coverModal: false,
        nametagsModal: false,
        manageDesign: false,
        // frameModal: false,
        // bannerModal: false,
    })

    const handleModal1 = (e) => {
        setModal({...modal, templateModal: e})
    }

    const handleModal2 = (e) => {
        setModal({...modal, frameModal: e})
    }

    const handleModal3 = (e) => {
        setModal({...modal, bannerModal: e})
    }

    const handleModal4 = (e) => {
        setModal({...modal, coverModal: e})
    }

    const handleModal5 = (e) => {
        setModal({...modal, nametagsModal: e})
    }

    const handleModal6 = (e) => {
        setModal({...modal, manageDesign: e})
    }

    const alertState = (m, v, h) => {
        setAlert({...alert, message: m, variant: v, heading: h, box: true})
    }
    
    const alertBox = () => {
        return (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, box: false})} style={{padding:15}} dismissible>
                <Alert.Heading>{alert.heading}</Alert.Heading>
                <p>
                    { alert.message }
                </p>
            </Alert>
        );
    }

    const onChangeValue = (event) => {
        setData({...data, design: event.target.value})
    }

    return (
        <div className="wrap">
            {
                modal.templateModal ? 
                <UploadModals
                    label = "Template"
                    isOpen = {modal.templateModal}
                    bool = {handleModal1}
                    result = {alertState}
                    dispatch = {uploadTemplate}
                /> : null
            }
            {/* {
                modal.frameModal ? 
                <UploadModals
                    label = "Frame"
                    isOpen = {modal.frameModal}
                    bool = {handleModal2}
                    result = {alertState}
                    dispatch = {uploadFrame}
                /> : null
            }
            {
                modal.bannerModal ?
                <UploadModals
                    label = "Banner"
                    isOpen = {modal.bannerModal}
                    result = {alertState}
                    dispatch = {uploadBanner}
                    bool = {handleModal3}
                /> : null

            }            */}
            {
                modal.coverModal ? 
                <UploadModals
                    label = "Cover Page"
                    isOpen = {modal.coverModal}
                    result = {alertState}
                    dispatch = {uploadCover}
                    bool = {handleModal4}
                /> : null
            }  
            {
                modal.nametagsModal ?
                <UploadModals
                    label       = "Nametags"
                    isOpen      = {modal.nametagsModal}
                    result      = {alertState}
                    dispatch    = {uploadNametags}
                    bool = {handleModal5}
                /> : null
            }
            {
                modal.manageDesign ?
                <ManageDesign
                    label       = "Nametags"
                    isOpen      = {modal.manageDesign}
                    category    = {["Cover", "Template", "Nametag"]}
                    result      = {alertState}
                    dispatch    = {uploadNametags}
                    bool = {handleModal6}
                /> : null
            } 

            <div>
                <Link to="/admin/template" style={{ textDecoration: 'none' }}>
                    <Button variant="primary" style={{borderRadius:0}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
                </Link>
                <Dropdown id="newTemplate"  as={ButtonGroup} style={{marginRight:20}}>
                    <Button variant="primary">New</Button>

                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                    <Dropdown.Menu>
                        <Dropdown.Item variant="primary" onClick={() => setModal({...modal, templateModal: true})}> + New Template</Dropdown.Item>
                        {/* <Dropdown.Item                   onClick={() => setModal({...modal, frameModal: true})}> + New Frame</Dropdown.Item>
                        <Dropdown.Item                   onClick={() => setModal({...modal, bannerModal: true})}> + New Banner</Dropdown.Item> */}
                        <Dropdown.Item                   onClick={() => setModal({...modal, coverModal: true})}> + New CoverPage</Dropdown.Item>
                        <Dropdown.Item                   onClick={() => setModal({...modal, nametagsModal: true})}> + New Nametags</Dropdown.Item>
                        <Dropdown.Item                   onClick={() => setModal({...modal, manageDesign: true})}> Manage Designs</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <hr className="hr"/>
            {alert.box ? alertBox() : null}
            <Form>
                    <div className="mb-3">
                        <Form.Check
                            inline
                            checked={data.design === "single"}
                            label="Single Template Design"
                            name="group1"
                            type="radio"
                            value = "single"
                            onChange={onChangeValue}
                            id={`inline-radio-1`}
                        />
                        <Form.Check
                            inline
                            label="Multi Template Design"
                            name="group1"
                            type="radio"
                            value = "multiple"
                            onChange={onChangeValue}
                            id={`inline-radio-2`}
                        />
                    </div>
            </Form>
            {
                data.design === "single" ? 
                    <SingleDesign/>
                    :
                    <MultiDesign
                        newRecord={alert.message}
                    />
            }
        </div>
    )
}

export default CreateBatchTemplate
