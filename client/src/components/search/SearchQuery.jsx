import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getSearchQuery } from '../../actions/institute';
import { Button,  Alert } from 'react-bootstrap';
import { institute_list } from '../../assets/JsonData/institute'
import EditAlumni from '../institute/EditAlumni';

import Tooltip from "@material-ui/core/Tooltip";
import Done from "@material-ui/icons/Done";
import CloseIcon from '@material-ui/icons/Close';

const SeachQuery = props => {
    const inst = useSelector((state) => state.institute)
    var alumni_list = useSelector((state) => state.institute.query)
    const path1 = props.location.pathname.substring(0, props.location.pathname.lastIndexOf('/'))
    const path2 = path1.substring(0, path1.lastIndexOf('/'))
    const active_route = institute_list.findIndex(item => path2 === item.route)
    
    const [filter, setFilter] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSearchQuery({
            search: props.match.params.alumni
        }))
        setEditAlumni(false)
    }, [dispatch, props.match.params.alumni, active_route])

    useEffect(() => {

        if(inst.message){
            alertState(inst.message, inst.variant, inst.heading, inst.duplication)
            inst.message = '' //prevent infinite render
            inst.variant = '' //prevent infinite render
            inst.heading = '' //prevent infinite render
            inst.duplication = '' //prevent infinite render
        }

        if(alumni_list)
            setFilter(alumni_list.filter(o => Object.keys(o).some(k => o[k] !== null && o[k].toString().toLowerCase().includes(props.match.params.alumni))))
    }, [inst.message, inst])

    const [alert, setAlert] = useState({
        message: '',
        box: false,
        variant: '',
        duplication: '',
        heading: ''
    });
    
    const alertState = (m, v, h, d) => {
        setAlert({...alert, message: m, variant: v, heading: h, duplication: d, box: true})
    }
    
    const alertBox = () => {
        return (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, box: false})} style={{padding:15}} dismissible>
                <Alert.Heading>{alert.heading}</Alert.Heading>
                <p>
                    { alert.message } <br/>
                    { alert.duplication &&
                        !alert.duplication.includes("0") &&
                            <p style={{color:"red", fontWeight: 500}}>
                                { alert.duplication }
                            </p>                      
                    }
                </p>
            </Alert>
        );
    }

    const columns = [
        {
            name: "student_number",
            label: "Student Number",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "full_name",
            label: "Name",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "main",
            label: "Main Image",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value === 1)
                  return (
                    <Tooltip title="Uploaded">
                        <Done color="primary" />
                    </Tooltip>
                  );
                else
                    return (
                        <Tooltip title="Not Uploaded">
                            <CloseIcon color="error" />
                        </Tooltip>
                    );
              }
            }
        },
        {
            name: "sub",
            label: "Sub Image",
            options: {
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value === 1)
                  return (
                    <Tooltip title="Uploaded">
                        <Done color="primary" />
                    </Tooltip>
                  );
                else
                    return (
                        <Tooltip title="Not Uploaded">
                            <CloseIcon color="error" />
                        </Tooltip>
                    );
              }
            }
        },
        {
            name: "images",
            label: "Images",
            options: {
                filter: true,
                sort: false,
            }
        },
            {
            name: "action",
            label: "Action",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <>  
                            <Button variant="warning" style={{fontSize:15, marginRight:5}} onClick={() => editId(tableMeta)}><i className="bx bxs-edit"></i></Button>
                        </>
                    )
                }
            }
        },
    ];

    const editId = (e) => {
        setId(alumni_list[e.rowIndex]._id)
        setIndex(e.rowIndex)
        setEditAlumni(1)
    }

    const [editAlumni, setEditAlumni] = useState(0)
    const [id, setId] = useState('')
    const [index, setIndex] = useState(0)
    const options = {
        selectableRows: 'none', 
        filterType: 'checkbox',
        viewColumns: false,
        download: false,
        filter: false,
        print: false,
        responsive: "standard",
    };

    return (
        <div className="wrap">     
            {
                editAlumni ? 
                    <EditAlumni
                        id={alumni_list.find((p) => p._id === id)}
                        setEditAlumni={setEditAlumni}
                        academic_year={alumni_list[index].info.batch_id.academic_year}
                        section={`${alumni_list[index].info.section_id.program_acronym} ${alumni_list[index].info.section_id.section}`}
                        institute={alumni_list[index].info.section_id.institute}
                    />  : 
                    <>
                        {alert.box ? alertBox() : null}
                        <MUIDataTable
                            title={`Search Query`}
                            data={alumni_list && filter}
                            columns={columns}
                            options={options}
                        />
                    </>            
            }
        </div>
    )
}

export default SeachQuery
