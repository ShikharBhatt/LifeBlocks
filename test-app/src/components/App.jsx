import React, {Component} from 'react';
import {connect} from 'react-redux';
class App extends Component{

    SignOut(){
        console.log('Logged Out')
    }

    render(){
        return(
            <div>
            <div>App</div>
            <button
                className="btn btn-danger"
                onClick={()=>this.SignOut()}
            >
                SignOut
            </button>
            </div>
        )
    }
}

function mapStateToProps(state){
    console.log('state', state);
    return{}
}

export default connect(mapStateToProps, null)(App);