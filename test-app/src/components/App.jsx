import React, {Component} from 'react';
import {connect} from 'react-redux';
import {logUser} from '../actions';
import {browserHistory} from "react-router";
import '../App.css';
import '../css/pure-min.css';
import {ViewRecords} from './ViewRecords';
import Upload from './Upload';
// import {Provider} from 'react-redux';
// import {createStore} from 'redux';
// import reducer from '../reducers';


class App extends Component{

    constructor(props){
        super(props)

        if(this.props.user.aadhaar === null){
            browserHistory.push("/signin")
        }
        

    }

    SignOut(){
        let aadhaar = null
        this.props.dispatch(logUser(aadhaar))
        browserHistory.push("/signin");        // go to app page
        console.log('Logged Out')
    }

    // changeUser(){
    //     alert("Called")
    //     let aadhaar = '7898789878'
    //     this.props.dispatch(logUser(aadhaar))
    // }

    // checkAnser(){
    //     alert(this.props.user.aadhaar)
    // }

    render(){
        console.log(this.props.user.aadhaar)
        return(
            <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">User Application</a>
          <a href="#" className="pure-menu-heading pure-menu-link">ID:{this.props.user.aadhaar}</a>
          <a href="#" className="pure-menu-heading pure-menu-link" onClick={()=>this.SignOut()}>           
                SignOut
           </a>
        </nav>
            <div>
            {/* <div>App</div>
            <div>My Aadhaar:{this.props.user.aadhaar}</div> */}
            <Upload/>
            </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    //console.log('state', state);

    return{
        user:state
    }
}




export default connect(mapStateToProps, null)(App);