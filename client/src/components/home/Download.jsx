import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'

import MUIDataTable from "mui-datatables";
import { getDownloads } from '../../actions/home';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

const Download = () => {

    const home_downloads = useSelector((state) => state.home.downloads)

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        document.title = "Download"
    }, [])
    
    useEffect(() => {
        if(!user) history.push('/')
        else dispatch(getDownloads({id: user.result.alumni_id}))
    }, [user, dispatch])

    const columns = [
        {
            name: "file_name",
            label: "Filename",
            options: {
                filter: true,
                sort: true,
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
                            <a href={home_downloads.length > 0 ? `${home_downloads[tableMeta.rowIndex].uri}` : '#'}>Download</a>
                        </>
                    )
                }
            }
        }
    ];
    
    const options = {
        selectableRows: 'none',
        filterType: 'checkbox',
        responsive: true,
        print: false,
        search: false,
        viewColumns: false,
        filter: false,
        download: false,
        textLabels: {
            body: {
                noMatch:
                    'Sorry, there is no data available to display',
            },
        },
    };

    return (
        <div>
            <Header/>
            <div style={{height: "70vh"}}>
                <h3 className="hr__separator gray" style={{margin: "30px 0"}}>DOWNLOAD YEARBOOK</h3>

                <section style={{padding: "0 5%"}}>
                    <MUIDataTable
                        data={home_downloads && home_downloads}
                        columns={home_downloads && columns}
                        options={options}
                    />
                </section>
            </div>
            <Footer/>
        </div>
    )
}

export default Download
