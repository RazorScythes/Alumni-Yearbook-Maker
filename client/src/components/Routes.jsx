import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Overview from './overview/Overview'

import BatchTemplate from './batch-template/BatchTemplate'
import CreateBatchTemplate from './batch-template/CreateBatchTemplate'

import Institute from './institute/Institute'
import InstituteList from './institute/InstituteList'
import Section from './institute/Section'
import Alumni from './institute/Alumni'

import CommenceYearList from './graduation-message/CommenceYearList'
import Commence from './graduation-message/Commence'

import AdminYearList from './administrators/AdminYearList'
import Administrators from './administrators/Administrators'
import Administration from './administrators/Administration'

import HAYearList from './honor-and-awards/HA-YearList'
import HA from './honor-and-awards/HA'

import Gallery from './gallery/Gallery'
import EventsYearList from './events/EventsYearList'
import News_Events from './events/News&Events'
import News from './events/News'
import Events from './events/Events'

import PDFYearList from './pdf-control/PDFYearList'
import PDFList from './pdf-control/PDFList'
import OrderList from './orders/OrderList'

import Profile from './profile/Profile'
import Inbox from './inbox/Inbox'
import AccountRole from './manage-account/AccountRole'
import AccountList from './manage-account/AccountList'

import SearchQuery from './search/SearchQuery'
import EditAlumni from './search/EditAlumni'
const Routes = () => {
    return (
        <Switch>
            <Route path='/admin' exact component={Overview}/>
            {/* <Route path='/template' component={UploadTemplate}/> */}

            <Route path='/admin/template' exact component={BatchTemplate}/>
            <Route path='/admin/template/new' component={CreateBatchTemplate}/>

            <Route path='/admin/institute' exact component={Institute}/>
            <Route path='/admin/institute/:institute' exact component={InstituteList}/>
            <Route path='/admin/institute/:institute/:ay' exact component={Section}/>
            <Route path='/admin/institute/:institute/:ay/:section' exact component={Alumni}/>

            <Route path='/admin/commence' exact component={Commence}/>
            <Route path='/admin/commence/:speech' exact component={CommenceYearList}/>

            <Route path='/admin/administration' exact component={Administration}/>
            <Route path='/admin/administrators/:ay' exact component={Administrators}/>

            <Route path='/admin/exercise-gallery' exact component={Gallery}/>

            <Route path='/admin/honor&awards' exact component={HAYearList}/>
            <Route path='/admin/honor&awards/:ay' exact component={HA}/>

            {/* <Route path='/news&events' exact component={EventsYearList}/> */}
            <Route path='/admin/news&events' exact component={News_Events}/>
            <Route path='/admin/news&events/news' exact component={News}/>
            <Route path='/admin/news&events/events' exact component={Events}/>

            <Route path='/admin/pdf_maker' exact component={PDFYearList}/>
            <Route path='/admin/pdf_maker/pdf-control' exact component={PDFYearList}/>
            <Route path='/admin/pdf_maker/pdf-control/:ay' exact component={PDFList}/>
            <Route path='/admin/pdf_maker/orders' exact component={OrderList}/>

            <Route path='/admin/change-password' exact component={Profile}/>
            <Route path='/admin/inbox' exact component={Inbox}/>

            <Route path='/admin/account-manage' exact component={AccountRole}/>
            <Route path='/admin/account-manage/:role' exact component={AccountList}/>

            <Route path='/admin/search/:alumni' exact component={SearchQuery}/>
            <Route path='/admin/edit/:student_number' exact component={EditAlumni}/>
        </Switch>
    )
}

export default Routes
