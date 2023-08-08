import React, { useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from 'react-redux'
import { getAccountRole, getAccounts } from '../../actions/accounts';
import { Button, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'

import Tooltip from "@material-ui/core/Tooltip";
import './styles.css'
const AccountRole = props => {
    const roles = useSelector((state) => state.accounts.account_role)
    const user = JSON.parse(localStorage.getItem('profile'))

    const dispatch = useDispatch()
    const history = useHistory()
    
    useEffect(() => {
        if(user?.result.role !== "Admin") history.push('/admin')

        dispatch(getAccountRole())
    }, [])

    const goto = (e) => {
        history.push(`${props.location.pathname}/${roles[e.rowIndex].role}`)
    }

    const columns = [
        {
            name: "role",
            label: "Role",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "counts",
            label: "Total",
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
                        <Tooltip title="View Record">
                            <Button variant="warning" style={{fontSize:15}} onClick={() => goto(tableMeta)}><i className="bx bxs-user-detail"></i></Button>
                        </Tooltip>
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
        customHeadRender: () => null
    };

    return (
        <div style={{padding:20}}>
            {
                user?.result.role === "Admin" ?
                <>
                    <Alert variant="warning">
                        <Alert.Heading>Admin Only Page</Alert.Heading>
                        <p>
                            You can view, select and modify users account in this page.
                        </p>
                    </Alert>
                    <MUIDataTable
                        title={"Manage Accounts"}
                        data={roles && roles}
                        columns={roles && columns}
                        options={options}
                    />
                </> : 
                <Alert variant="danger">
                    <Alert.Heading>Error 401 - Unauthorized</Alert.Heading>
                    <p>
                        You don't have permission to view this page
                    </p>
                    <hr />
                    <p className="mb-0">
                        Please contact the administrator for further concerns
                    </p>
                </Alert>
            }
        </div>
    )
}

export default AccountRole
