import React, { useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getAdminYear } from '../../actions/administrators';
import { getOrders, setStatusReleasing, setStatusOK } from '../../actions/orders';
import { Button, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'

import Done from "@material-ui/icons/Done";
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from "@material-ui/core/Tooltip";

import './styles.css'
const OrderList = props => {
    const order_list = useSelector((state) => state.orders.order_list)

    const dispatch = useDispatch()
    const history = useHistory()
    
    const user = JSON.parse(localStorage.getItem('profile'))

    const restricted_roles = "Staff"

    useEffect(() => {
        dispatch(getOrders())
    }, [dispatch])

    const columns = [
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
        },
            {
            name: "action",
            label: "Action",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if(user?.result.role !== restricted_roles) {
                        if (value === "pending")
                            return (
                                <Button variant="primary" onClick={() => setReleasing(order_list[tableMeta.rowIndex].id)} style={{fontSize:12}} >Release</Button>
                            );
                        else if(value === "releasing")
                            return (
                                <Button variant="primary" onClick={() => setOK(order_list[tableMeta.rowIndex].id)} style={{fontSize:12}} >OK</Button>
                            );
                        else if(value === "ok")
                            return(
                                <Tooltip title="Done">
                                    <Done color="primary" />
                                </Tooltip>
                            )
                    }
                    else if(value === "ok")
                        return(
                            <Tooltip title="Done">
                                <Done color="primary" />
                            </Tooltip>
                        )
                    else 
                        return(
                            <>
                                <Tooltip title="Restricted Actions">
                                    <CloseIcon color="error" />                                       
                                </Tooltip>
                            </>
                        )
                }
            }
        },
    ];

    const setReleasing = (id) => {
        dispatch(setStatusReleasing({id: id}))
        console.log("release", id)
    }

    const setOK = (id) => {
        dispatch(setStatusOK({id: id}))
        console.log("ok", id)
    }


    const options = {
        selectableRows: 'none', 
        filterType: 'checkbox',
        viewColumns: false,
        download: false,
        print: false,
        responsive: "standard",
    };

    return (
        <div style={{padding:20}}>
            <Alert variant="warning">
                <Alert.Heading>Yearbook Requests</Alert.Heading>
                    
                        This page serves for pending yearbooks that alumni requests for ordering yearbook. <br/>
                        {/* <hr />
                        <b>Pending</b> - Must process first before printing <br/>
                        <b>Releasing</b> - Alumni can now claim the yearbook from the registrar <br/>
                        <b>OK</b> - Yearbook claimed <br/> */}
                   
                </Alert>
            <MUIDataTable
                title={"Yearbook Orders"}
                data={order_list && order_list}
                columns={columns}
                options={options}
            />
        </div>
    )
}

export default OrderList
