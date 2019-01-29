import React, {Component} from 'react';
import {connect} from 'react-redux';
import {logUser} from '../actions';
import {browserHistory} from "react-router";
import '../App.css';
import {ViewRecords} from './ViewRecords';
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
            <div>
            <div>App</div>
            <div>My Aadhaar:{this.props.user.aadhaar}</div>
            <button
                className="btn btn-danger"
                onClick={()=>this.SignOut()}
            >

           
                SignOut
            </button>
            <ViewRecords/>
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