import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button,  Alert } from 'react-bootstrap';
import EditAlumni from '../institute/EditAlumni';

import { getSearchAlumni } from '../../actions/institute';
const EditSearchAlumni = props => {
    const dispatch = useDispatch()
    const inst = useSelector((state) => state.institute)
    const selected_alumni = useSelector((state) => state.institute.selected_edit)

    useEffect(() => {
        dispatch(getSearchAlumni({student_number: props.match.params.student_number}))
    }, [dispatch, props.match.params.student_number])

    useEffect(() => {
        if(inst.edit_message){
            alertState(inst.edit_message, inst.edit_variant)
            inst.edit_message = '' //prevent infinite render
            inst.edit_variant = '' //prevent infinite render
        }
    }, [inst.edit_message, inst])

    const [alert, setAlert] = useState({
        message: '',
        box: false,
        variant: '',
    });

    const alertState = (m, v) => {
        setAlert({...alert, message: m, variant: v, box: true})
    }

    const alertBox = () => {
        return (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, box: false})} style={{padding:15}} dismissible>
                {alert.message}
            </Alert>
        );
    }

    return (
        <div className="wrap">
            {
                selected_alumni !== undefined && selected_alumni.length > 0 ?
                    <EditAlumni
                        hideback={true}
                        Linkedin={true}
                        id={selected_alumni[0]}
                        academic_year={selected_alumni[0].info.batch_id.academic_year}
                        section={`${selected_alumni[0].info.section_id.program_acronym} ${selected_alumni[0].info.section_id.section}`}
                        institute={selected_alumni[0].info.section_id.institute}
                    />
                : alert.box ? alertBox() : null
            }
            {/* <EditAlumni/> */}
        </div>
    )
}

export default EditSearchAlumni
