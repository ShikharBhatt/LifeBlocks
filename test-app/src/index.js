import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
//import {firebaseApp} from './firebase';
//import { store, persistor } from "./config/configureStore";
import {Router, Route, browserHistory} from 'react-router';
import './index.css';
import { PersistGate } from "redux-persist/integration/react";
import App from './components/App';
import Signin from './components/Signin';
import Signup from './components/Signup';
import ViewRecords from './components/ViewRecords'
import Upload from './components/Upload'
import reducer from './reducers';
//import {logUser} from './actions';


const store = createStore(reducer)

var currentState = store.getState()
alert("index.js")
if(currentState.aadhaar === null){
    // store.dispatch(logUser(aadhaar))
    browserHistory.replace('/signin')
}
else{
    browserHistory.push('/app')
}
//browserHistory.replace('/signin')



ReactDOM.render(
    <Provider store={store}>
    {/* <PersistGate persistor={persistor}> */}
    <Router path="/" history={browserHistory}>
        <Route path="/app" component={App} default/>
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Route path="/viewrecord" component={ViewRecords} />
        <Route path="/upload" component={Upload} />
    </Router>
    {/* </PersistGate> */}
    </Provider>, document.getElementById('root')
);

