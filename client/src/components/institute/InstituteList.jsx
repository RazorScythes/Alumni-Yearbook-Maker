import React, { useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getInstituteCounts } from '../../actions/institute';
import { Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import { institute_list } from '../../assets/JsonData/institute'

const InstituteList = props => {
    const counts = useSelector((state) => state.institute.a_y_counts)
    const active_route = institute_list.findIndex(item => props.location.pathname === item.route)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        // if(active_route >= 0) dispatch(getInstituteCounts({institute: institute_list[active_route].acronym}))
        dispatch(getInstituteCounts({institute: props.match.params.institute.toUpperCase()}))
    }, [props.location.pathname])

    const goto = (e) => {
        history.push(`${props.location.pathname}/${counts.data[e.rowIndex].academic_year}`)
    }

    const columns = [
        {
            name: "academic_year",
            label: "Academic Year",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "sections",
            label: "Total Sections",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "alumni",
            label: "Total Alumni",
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
                            <Button variant="warning" style={{fontSize:15}} onClick={() => goto(tableMeta)}><i className="bx bxs-user-detail"></i></Button>
                        </>
                    )
                }
            }
        },
    ];

    const options = {
        selectableRows: 'none', 
        filterType: 'checkbox',
        download:true,
        filter: false,
        print: false,
        responsive: "standard",
    };

    return (
        <div style={{padding:20}}>
            <Link to='/admin/institute' style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{borderRadius:0, margin:"10px 0"}}><i className="bx bx-left-arrow-circle" style={{fontSize:20, verticalAlign:"middle"}}/> Go Back</Button>
            </Link>
            <MUIDataTable
                title={counts ? counts.display_name : "Institute not Found"}
                data={counts && counts.data}
                columns={counts && columns}
                options={options}
            />
        </div>
    )
}

export default InstituteList
