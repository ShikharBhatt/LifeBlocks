import React, {Component} from 'react';
import {connect} from 'react-redux';
import {logUser} from '../actions';
// import {Provider} from 'react-redux';
// import {createStore} from 'redux';
// import reducer from '../reducers';


class App extends Component{

    SignOut(){
        console.log('Logged Out')
    }

    changeUser(){
        alert("Called")
        let aadhaar = '7898789878'
        this.props.dispatch(logUser(aadhaar))
    }

    checkAnser(){
        alert(this.props.user.aadhaar)
    }

    render(){
        console.log(this.props.user.aadhaar)
        return(
            <div>
            <div>App</div>
            <div>{this.props.user.aadhaar}</div>
            <button
                className="btn btn-danger"
                onClick={()=>this.changeUser()}
            >

           
                SignOut
            </button>
             {/* {this.changeUser} */}
             <button
                className="btn btn-danger"
                onClick={()=>this.checkAnser()}
            >

           
                SigchecknOut
            </button>
            
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