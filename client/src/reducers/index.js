import { combineReducers  } from "redux";

import overviews from './overview'
import batch from './batch-template'
import institute from './institute'
import commence from './commence'
import events from "./events";
import pdfControl from "./pdf-control";
import administrators from "./administrators";
import auth from "./auth";
import profile from "./profile";
import accounts from "./accounts";
import ha from "./honor-and-awards"
import home from './home'
import orders from "./orders";
import gallery from "./gallery";
import inbox from './inbox'

export default combineReducers({ 
    overviews, 
    batch, 
    institute, 
    commence, 
    events, 
    pdfControl, 
    administrators, 
    auth,
    profile, 
    accounts, 
    ha, 
    home, 
    orders,
    gallery,
    inbox
 })