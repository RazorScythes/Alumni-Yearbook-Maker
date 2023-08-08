import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import EditMulti from './EditMulti'
import EditSingle from './EditSingle'

import { Form } from 'react-bootstrap';

const EditBatchTemplate = props => {
    const batch = useSelector((state) => props.id ? state.batch.batch_year.find((p) => p._id === props.id) : null)

    const [data, setData] = useState({
        design: 'single'
    })

    const onChangeValue = (event) => {
        setData({...data, design: event.target.value})
    }

    useEffect(() => {
        if(batch.multipage)
            setData({...data, design: 'multiple'})
    },[batch.multipage]) //added data

    return (
        <>
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
                            checked={data.design === "multiple"}
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
                data.design === 'multiple' ? 
                    <EditMulti
                        data={batch}
                        setEditId={props.setEditId}
                    />
                    :
                    <EditSingle
                        setEditId={props.setEditId}
                        data={batch}
                    />
            }
        </>
    )
}

export default EditBatchTemplate
