import React, { useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getCommenceYear } from '../../actions/commence';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'
import './styles.css'
const CommenceYearList = props => {
    const year_list = useSelector((state) => state.commence.academic_year)
    
    const dispatch = useDispatch()
    const history = useHistory()
    
    useEffect(() => {
        dispatch(getCommenceYear())
    }, [dispatch])

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
            label: "Total Created Message",
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
            <MUIDataTable
                title={"Batch Year Commence Message/s"}
                data={year_list && year_list}
                columns={year_list && columns}
                options={options}
            />
        </div>
    )
}

export default CommenceYearList
