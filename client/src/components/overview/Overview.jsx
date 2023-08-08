import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from '@material-ui/core';
import './styles.css'

import { getOverviewData } from '../../actions/overview'

// import Table from '../overview-table/Table';

const getMuiTheme = () => createTheme({
    overrides: {
      MUIDataTable: {
        responsiveScroll: {
          maxHeight:'450px !important' 
        }
      },
    }
  })

// const customerTableHead = [
//     'Student Number',
//     'Name',
//     'Academic Year',
//     'Institute',
//     'Program'
// ]

// const renderHead = (item, index) => <th key={index}>{item}</th>

// const renderBody = (item, index) => (
//     console.log(1),
//     <tr key={index}>
//         <td>{item.student_number}</td>
//         <td>{item.full_name.first_name} {item.full_name.last_name}</td>
//         <td>{item.batch_id.academic_year}</td>
//         <td>{item.batch_id.academic_year}</td>
//         <td>{item.batch_id.academic_year}</td>
//         {/* <td>{item.section.institute}</td>
//         <td>{item.section.program}</td> */}
//     </tr>
// )

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
        name: "name",
        label: "Name",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "institute",
        label: "Institute",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "program",
        label: "Program",
        options: {
            filter: true,
            sort: false,
        }
    }
];

const orderColumns = [
    {
        name: "name",
        label: "Name",
        options: {
            filter: true,
            sort: true,
        }
    },          
    {
        name: "institute",
        label: "Institute",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "yearbook",
        label: "Yearbook",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "status",
        label: "Status",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            if (value === "pending")
                return (
                    <div style={{background:"#DAA520", borderRadius:10, padding:7, maxWidth:"100px", textAlign:"center"}}>
                        <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px black"}}>Pending</p>
                    </div>
                );
            else if(value === "releasing")
                return (
                    <div style={{background:"#0275d8", borderRadius:10, padding:7, maxWidth:"100px", textAlign:"center"}}>
                        <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>Releasing</p>
                    </div>
                );
            else if(value === "ok")
                return (
                    <div style={{background:"#006400", borderRadius:10, padding:7, maxWidth:"50px", textAlign:"center"}}>
                        <p style={{fontSize:10, padding:0, margin:0, color:"white", textShadow:"1px 1px 1px gray"}}>OK</p>
                    </div>
                );
          }
        }
    }
];

const options = {
    selectableRows: 'none', 
    filterType: 'checkbox',
    viewColumns: false,
    download: false,
    print: false,
    responsive: "scroll",
};

const Overview = () => {
    const theme = getMuiTheme();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOverviewData())
    }, [dispatch])

    
    const overview_data = useSelector((state) => state.overviews.data)
   
    return (
        <>
        <div className="overview-boxes">
            <div className="box student">
            <div className="right-side">
                <i className="bx bxs-graduation"></i>
                <div className="number">
                    { overview_data && overview_data.total_graduates }
                    <i className="bi bi-people-fill"></i> </div>
                <div className="box-topic">Total Graduates</div>
            </div>
            </div>
            <div className="box section">
            <div className="right-side">
                <i className="bx bx-book-alt"></i>
                <div className="number">
                    { overview_data && overview_data.total_sold_yearbook }
                    <i class="bi bi-card-list"></i> </div>
                <div className="box-topic">Done Request</div>
            </div>
            </div>
            <div className="box events">
            <div className="right-side">
                <i className="bx bx-calendar-alt"></i>
                <div className="number">
                    { overview_data && overview_data.total_batchYear }
                    <i class="bi bi-card-list"></i> </div>
                <div className="box-topic">All BatchYear</div>
            </div>
            </div>
            <div className="box hide" style={{visibility: 'hidden'}}>
            <div className="right-side">
                <i className="bx bx-user"></i>
                <div className="box-topic"></div>
                <div className="number"><i className="bi bi-people-fill"></i> </div>
            </div>
            </div>
        </div>
        <div className="boxes">
            <div className="recent-student box">
                {/* <div className="title student">Recent Graduates</div> */}
                
                <MuiThemeProvider theme={theme}>
                    <MUIDataTable
                        title={`Recent Graduates ( ${(overview_data !== undefined) ? overview_data.academic_year : 'No new record '})`}
                        data={overview_data && overview_data.new_graduates}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
                {/* { 
                    alumni !== undefined &&
                        <Table
                            limit='50'
                            headData={customerTableHead}
                            renderHead={(item, index) => renderHead(item, index)}
                            bodyData= { alumni }
                            renderBody={(item, index) => renderBody(item, index)}
                        />
                }  */}
            </div>
            <div className="recent-events box">
            {/* <div className="title events">Recent Events</div> */}
                <MuiThemeProvider theme={theme}>
                    <MUIDataTable
                        title={`Pending Yearbook Requests`}
                        data={overview_data && overview_data.pending_orders}
                        columns={orderColumns}
                        options={options}
                    />
                </MuiThemeProvider>
                {/* <div className="event-container">
                    <Card>
                        <Card.Header as="h6" style={{fontSize: "18px", color: "#000"}}>Featured</Card.Header>
                            <Card.Body>
                                <Card style={{maxHeight: "200px", overflowY: "auto"}}>
                                    <GridImage/>
                                </Card>
                                <Card.Title>Special title treatment</Card.Title>
                                <Card.Text style={{fontSize: "14px"}}>
                                    With supporting text below as a natural lead-in to additional content.
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer as="h6" style={{ textAlign:"right", fontSize: "13px", color: "#818181"}}>Hello</Card.Footer>
                    </Card>
                </div> */}
            </div>
        </div>
        </>
    )
}

export default Overview
