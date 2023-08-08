import React, { useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getHAYear } from '../../actions/honors-and-awards';
import { Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import './styles.css'
const HAYearList = props => {
    const year_list = useSelector((state) => state.ha.ha_year)

    const dispatch = useDispatch()
    const history = useHistory()
    
    useEffect(() => {
        dispatch(getHAYear())
    }, [])

    const goto = (e) => {
        history.push(`${props.location.pathname}/${year_list[e.rowIndex].academic_year}`)
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
            name: "counts",
            label: "Total Honors and Awards",
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
        viewColumns: false,
        download: false,
        filter: false,
        print: false,
        responsive: "standard",
    };

    return (
        <div style={{padding:20}}>
            {
                year_list !== undefined && year_list.length > 0 ?  
                null
                : 
                <Alert variant="warning">
                    No Academic Year Found. Make sure you create one first <Link to={"/admin/template/new"} style={{ textDecoration: 'none' }}> Click Here </Link>
                </Alert>
            }
            <MUIDataTable
                title={"Honors and Awards"}
                data={year_list && year_list}
                columns={year_list && columns}
                options={options}
            />
        </div>
    )
}

export default HAYearList
