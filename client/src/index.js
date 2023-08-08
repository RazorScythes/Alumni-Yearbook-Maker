import React from "react";
import ReactDOM from "react-dom";
import HttpsRedirect from 'react-https-redirect';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'

import thunk from 'redux-thunk'
import reducers from './reducers'

//import rootReducer from './redux/reducers'

//import Layout from './components/layout/Layout'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/boxicons-2.0.7/css/boxicons.min.css'

// import '@fortawesome/fontawesome-free/css/all.min.css'; 
// import 'bootstrap-css-only/css/bootstrap.min.css'; 
// import 'mdbreact/dist/css/mdb.css';
// import './assets/css/grid.css'
// import './assets/css/index.css'

import Index from "./components/index/Index";

//console.log = console.warn = console.error = () => {};

const store = createStore(reducers, compose(applyMiddleware(thunk)))

//document.title = "Capstone"

ReactDOM.render(
  <Provider store={store}>
      <HttpsRedirect>
        <Index/>
      </HttpsRedirect>
  </Provider>,
    document.getElementById("root")
);

