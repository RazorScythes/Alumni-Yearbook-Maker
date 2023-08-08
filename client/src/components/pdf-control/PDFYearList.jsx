import React, { useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getPDFYear } from '../../actions/pdf-control';
import { Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'

import './styles.css'
const PDFYearList = props => {
    const year_list = useSelector((state) => state.pdfControl.academic_year)

    const dispatch = useDispatch()
    const history = useHistory()
    
    useEffect(() => {
        dispatch(getPDFYear())
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
            name: "items",
            label: "Items",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "counts",
            label: "Total Yearbook Generates",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "cover",
            label: "Cover Page",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(value)
                        return (
                            <>  
                                <img src={value} style={{width: 100, height: 130, border: "1px solid black", objectFit: "cover"}}/>
                            </>
                        )
                }
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
                            <Button variant="warning" style={{fontSize:15}} onClick={() => goto(tableMeta)}><i className="bx bxs-file"></i></Button>
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
        textLabels: {
            body: {
                noMatch:
                    'Sorry, there is no data to display',
            },
        },
    };

    return (
        <div style={{padding:20}}>

            <MUIDataTable
                title={"PDF Academic Year List"}
                data={year_list && year_list}
                columns={year_list && columns}
                options={options}
            />
        </div>
    )
}

export default PDFYearList
