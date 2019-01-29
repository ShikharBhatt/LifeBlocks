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
import reducer from './reducers';
import {logUser} from './actions';


const store = createStore(reducer)

// const aadhaar = '1234567890'
// if(aadhaar === '1234567890'){
//     store.dispatch(logUser(aadhaar))
//     browserHistory.push('/app')
// }
// else{
//     browserHistory.replace('/signin')
// }

ReactDOM.render(
    <Provider store={store}>
    <Router path="/signup" history={browserHistory}>
        <Route path="/app" component={App} default/>
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
    </Router>
    </Provider>, document.getElementById('root')
);

