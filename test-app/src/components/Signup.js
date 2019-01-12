import React, {Component} from 'react';
import {Link} from 'react-router';
import {firebaseApp} from '../firebase';
import * as firebase from 'firebase'

class Signup extends Component{
    constructor(props){
        super(props);

        this.state={            //declaring state variables
            aadhaar:"",
            currenAddress:null,
            phone:null
        }
        this.SignUp = this.SignUp.bind(this)
        this.myFunction = this.myFunction.bind(this)
    }

    SignUp(event){                      //function handling the signup event
        event.preventDefault()
        console.log("Got aadhaar", this.state.aadhaar)
        firebaseApp.database().ref('/uidai/').orderByChild('aadhaar_no').equalTo(this.state.aadhaar).once('value').then(function(snapshot) {
          // alert("Parent")
           snapshot.forEach(function(child){
               var value = child.val()
              // alert("Child")
               console.log(value)
            //    this.setState({
            //        phone:value.phone
            //    })
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container'); 
            firebase.auth().signInWithPhoneNumber("+91"+value.phone, window.recaptchaVerifier)
            .then(function(confirmationResult) { 
                window.confirmationResult = confirmationResult; 
                //a(confirmationResult); 
                })
        })           
          })

    }
    myFunction = function() { 
            window.confirmationResult.confirm(document.getElementById("verificationcode").value) 
            .then(function(result) { 
            alert('login process successfull!\n redirecting');
            alert('<a href="javascript:alert(\'hi\');">alert</a>')
            window.location.href="/signin";
            }, function(error) { 
            alert(error); 
            }); 
            };


    render(){
        return(
            <div className="form-inline">
                <h2>Sign Up</h2>
                <div className="form-group">

                {/* Sign Up  Form */}
                
                    <form onSubmit={this.SignUp}>       
                        <input 
                            className="form-control"
                            type="text"
                            placeholder="Aadhaar Number" 
                            // pattern=".{10,10}"
                            // min="0000000001"
                            onChange={event => this.setState({aadhaar:event.target.value})}
                            required={true}
                        />
                        
                        <input
                            className="btn btn-primary"
                            type="submit"
                        />  
                        
                    </form>
                    <form>
                    <input type="text" id="verificationcode"  />
                        <input type="button" value="Submit" onClick={this.myFunction} />
				</form>

                    <div id="recaptcha-container"></div>
                    <div><Link to={'/signin'}>Already Signed Up? Sign In Here</Link></div>
                </div>
            </div>
        )
    }
}

export default Signup;