import React, {Component} from 'react';
import {Link} from 'react-router';
import {firebaseApp} from '../firebase';
import * as firebase from 'firebase'
import getWeb3 from '../utils/getWeb3'
import {connect} from 'react-redux';
import {logUser} from '../actions';
import '../App.css'
import {browserHistory} from "react-router";


class Signin extends Component{
    constructor(props){
        super(props);

        this.state={            //declaring state variables
            aadhaar:"",
            web3:null,
            currentAddress:null,
            phone:null
    
        }
        this.SignIn = this.SignIn.bind(this)
        this.linkAadhaar = this.linkAadhaar.bind(this)
        this.myFunction = this.myFunction.bind(this)
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
       // alert(this.props.user.aadhaar)
        getWeb3
        .then(results => {
          this.setState({
            web3: results.web3
          })
    
          // Instantiate contract once web3 provided.
          this.instantiateContract()
        })
        .catch(() => {
          console.log('Error finding web3.')
        })
      }

    instantiateContract() {
    
        const contractAddress = '0x78478e7666bcb38b2ddeddfe7cb0ba152301df07'
        
        const ABI = [{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"aadhaarToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfskey","type":"string"}],"name":"link","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressToAadhaar","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getKeyHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_aadhaar","type":"uint256"}],"name":"addressLinked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_ipfshash","type":"string"}],"name":"keyLinked","type":"event"}]
                
        var RecordUploaderContract = new this.state.web3.eth.Contract(ABI, contractAddress)
        
        this.RecordUploaderContract = RecordUploaderContract
        
        // this.state.web3.eth.getAccounts((error, accounts) => {
        
        //     this.setState({ currentAddress: accounts[0] })  
        // })
        // console.log(this.state.currentAddress)
    
    }

    SignIn(event){                      //function handling the signup event
      
        event.preventDefault()

        // //getting phone number for the entered aadhaar number
        // firebaseApp.database().ref('/uidai/').orderByChild('aadhaar_no').equalTo(this.state.aadhaar).once('value').then(function(snapshot) {
        
        // snapshot.forEach(function(child){
        //     var value = child.val()

        //     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container'); 
            
        //     //send OTP to the phone number
        //     firebaseApp.auth().signInWithPhoneNumber("+91"+value.phone, window.recaptchaVerifier)
        //         .then(function(confirmationResult) { //wait for OTP verification
        //         window.confirmationResult = confirmationResult; 
                
        //         })
        //     })           
        // })

        this.state.web3.eth.getAccounts((error, accounts) => {  //get the account from metamask
            this.RecordUploaderContract.methods.login(this.state.aadhaar).call(
                {from:accounts[0]},function(error, x){  //check if account exists
                  if(error){
                    alert('Wrong')
                    return
                  }
                  if(x === true){
                    alert('Login Successfull')
                    this.RecordUploaderContract.methods.getAddress(this.state.aadhaar).call(
                        {from:accounts[0]},function(error, add){ //get account address from SC
                          if(error){
                            alert('Wrong')
                            return
                          }
                          if(add === accounts[0]){
                            alert('Login Successfull')
                            this.props.dispatch(logUser(this.state.aadhaar))    //if login successful then store aadhaar in app state
                            browserHistory.push("/app");        // go to app page
                        }
                          else{
                            alert('Details Incorrect')
                          }
                       }.bind(this))
                  }
                  else{
                    alert('Details Incorrect')
                  }
               }.bind(this))
        
        })       

    }

    //link aadhaar to account address using Smart Contract
    linkAadhaar(){
        //var success = 0

        this.state.web3.eth.getAccounts((error, accounts) => {
            this.UserDetailsContract.methods.login(this.state.aadhaar).call(
                {from:accounts[0]},function(error, x){
                  if(error){
                    alert('Wrong')
                    return
                  }
                  if(x == true){
                    alert('Login Successfull')
                    this.UserDetailsContract.methods.getAddress(this.state.aadhaar).call(
                        {from:accounts[0]},function(error, add){
                          if(error){
                            alert('Wrong')
                            return
                          }
                          if(add === accounts[0]){
                            alert('Login Successfull')
                          }
                          else{
                            alert('Details Incorrect')
                          }
                       })
                  }
                  else{
                    alert('Details Incorrect')
                  }
               })
        //     this.RecordUploaderContract.methods.login(this.state.aadhaar,{from:accounts[0]}).then((res) => {
        //         console.log('In link aadhaar: ',this.state.aadhaar )
        //         if(res){
        //             alert('Yes')
        //             this.RecordUploaderContract.getAddress(this.state.aadhaar,{from:accounts[0]}).then((addressReceived) => {

        //                 if(accounts[0] === addressReceived){
        //                     alert('Yes')
        // //                    window.location.href = '/app'
        //                 }
        //             })
        //                 }
        //     })
        })       
    }
    
    //confirm OTP function and call to linkAadhaar function
    myFunction = function() {
            
        let callLinkAadhaar = this.linkAadhaar        
        
        window.confirmationResult.confirm(document.getElementById("verificationcode").value) 
            .then(function(result) {       
            alert('Signin process successfull!\n redirecting');
            
            callLinkAadhaar()
            
           // window.location.href = '/signin'

            }, 

            function(error) { 
               alert(error); 
            })
                
    }
    
    render(){
        // return(
        //     <div className="form-inline">
        //         <h2>Sign-In</h2>
        //         <div className="form-group">

        //         {/* Sign Up  Form */}
                
        //             <form onSubmit={this.SignIn}>       
        //                 <input 
        //                     className="form-control"
        //                     type="text"
        //                     placeholder="Aadhaar Number" 
        //                     pattern=".{10,10}"
        //                     min="0000000001"
        //                     onChange={event => this.setState({aadhaar:event.target.value})}
        //                     required={true}
        //                 />
                        
        //                 <input
        //                     className="btn btn-primary"
        //                     type="submit"
        //                 />  
                        
        //             </form>
        //             <div><Link to={'/Signin'}>New User? Sign Up Here</Link></div>
        //         </div>
        //     </div>
        // )
        return(
            <div className="form-inline">
                <h2>Sign In</h2>
                <div className="form-group">

                {/* Sign In  Form */}
                
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
                    
                    
                    <div id="recaptcha-container"></div>

                    
                    <form>
                            <input 
                                type="text" 
                                id="verificationcode"  
                                pattern=".{6,6}"
                                min="000001"
                                placeholder="Enter OTP"
                            />
                            <input 
                                className="btn btn-primary" 
                                type="submit" 
                                onClick={this.myFunction} 
                            />
                    </form>
                  
                    <div><Link to={'/signup'}>New User? Sign Up Here</Link></div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state){
    
    return{
        user:state
    }
}

export default connect(mapStateToProps, null)(Signin);
