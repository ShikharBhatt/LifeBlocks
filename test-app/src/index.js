import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
//import {firebaseApp} from './firebase';
import {Router, Route, browserHistory} from 'react-router';
import './index.css';
import App from './components/App';
import Signin from './components/Signin';
import Signup from './components/Signup';
import ViewRecords from './components/ViewRecords'
import reducer from './reducers';
//import {logUser} from './actions';


const store = createStore(reducer)

var currentState = store.getState()
alert(currentState.aadhaar)
if(currentState.aadhaar === null){
    // store.dispatch(logUser(aadhaar))
    browserHistory.replace('/signin')
}
else{
    browserHistory.push('/app')
}

ReactDOM.render(
    <Provider store={store}>
    <Router path="/" history={browserHistory}>
        <Route path="/app" component={App} default/>
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Route path="/viewrecord" component={ViewRecords} />
    </Router>
    </Provider>, document.getElementById('root')
);

