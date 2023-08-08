import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './home/Home'
import Alumni from './home/Alumni'
import Events_Page from './home/Events_Page'
import Event from './home/Event'
import News from './home/News'
import Commence from './home/Commence'
import Order from './home/Order'
import Download from './home/Download'
import Academic_Year from './home/Academic_Year'
import UserLogin from './home/UserLogin'
import Query from './home/Query'
import Gallery from './home/Gallery'
import Change_Password from './home/Change_Password'
import Reset_Password from './home/Reset_Password'
import Help from './home/Help'
import SubmitMessage from './home/SubmitMessage'
import Graduates from './home/Graduates'

import PageNotFound from './PageNotFound'
const UserRoutes = () => {
    return (
        <Switch>    
            <Route path='/' exact component={Home}/>
            <Route path='/alumni/:id' exact component={Alumni}/>

            <Route path='/events' exact component={Events_Page}/>
            <Route path='/events/page/:page' exact component={Events_Page}/>
            <Route path='/events/search/:keyword' exact component={Events_Page}/>
            <Route path='/event/:post' exact component={Event}/>

            <Route path='/news/:post' exact component={News}/>

            <Route path='/commence/:id' exact component={Commence}/>

            <Route path='/yearbook' exact component={Download}/>
            <Route path='/order' exact component={Order}/>
            <Route path='/academic_year/:year' exact component={Academic_Year}/>
            <Route path='/login' exact component={UserLogin}/>

            <Route path='/help' exact component={Help}/>
            <Route path='/help/submit' exact component={SubmitMessage}/>

            <Route path='/change_password' exact component={Change_Password}/>
            <Route path='/search/:keyword' exact component={Query}/>
            <Route path='/gallery' exact component={Gallery}/>
            <Route path='/graduates' exact component={Graduates}/>
            <Route path='/reset_password/:id' exact component={Reset_Password}/>
            
            <Route path='*' component={PageNotFound}/>
        </Switch>
    )
}

export default UserRoutes
