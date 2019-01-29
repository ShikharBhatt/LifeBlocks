import React, {Component} from 'react';
import {Link} from 'react-router';

class Signin extends Component{
    constructor(props){
        super(props);

        this.state={            //declaring state variables
            aadhaar:"",
            currenAddress:null
        }
        this.Signin = this.SignIn.bind(this)
    }

    SignIn(event){                      //function handling the signup event
        event.preventDefault()
        
        console.log("Got aadhaar", this.state.aadhaar)
    }

    render(){
        return(
            <div className="form-inline">
                <h2>Sign-In</h2>
                <div className="form-group">

                {/* Sign Up  Form */}
                
                    <form onSubmit={this.SignIn}>       
                        <input 
                            className="form-control"
                            type="text"
                            placeholder="Aadhaar Number" 
                            pattern=".{10,10}"
                            min="0000000001"
                            onChange={event => this.setState({aadhaar:event.target.value})}
                            required={true}
                        />
                        
                        <input
                            className="btn btn-primary"
                            type="submit"
                        />  
                        
                    </form>
                    <div><Link to={'/signup'}>New User? Sign Up Here</Link></div>
                </div>
            </div>
        )
    }
}

export default Signin;