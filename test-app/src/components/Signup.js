import React, {Component} from 'react';
import {Link} from 'react-router';
import {firebaseApp} from '../firebase';
import * as firebase from 'firebase'
import getWeb3 from '../utils/getWeb3'
import '../App.css'

class Signup extends Component{
    constructor(props){
        super(props);

        this.state={            //declaring state variables
            aadhaar:"",
            web3:null,
            currentAddress:null,
            phone:null
           
        }
        this.SignUp = this.SignUp.bind(this)
        this.linkAadhaar = this.linkAadhaar.bind(this)
        this.myFunction = this.myFunction.bind(this)
    }


    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
    
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
       
        const contractAddress = '0x78478E7666BCB38B2DdEddfE7cb0BA152301Df07'
        
        const ABI = [{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"aadhaarToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ipfskey","type":"string"}],"name":"keymap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressToAadhaar","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"link","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_aadhaar","type":"uint256"}],"name":"addressLinked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_ipfshash","type":"string"}],"name":"keyLinked","type":"event"}]
        
        var RecordUploaderContract = new this.state.web3.eth.Contract(ABI, contractAddress)
        
        this.RecordUploaderContract = RecordUploaderContract
        
        this.state.web3.eth.getAccounts((error, accounts) => {
            console.log(accounts[0]);
            this.acc = accounts[0]
            console.log(this.acc)
            this.setState({ currentAddress: this.acc })  
        })
        this.setState({ currentAddress: this.acc })  

        //console.log(this.RecordUploaderContract)
     
      }

      
    SignUp(event){                      //function handling the signup event
      
        event.preventDefault()

        //getting phone number for the entered aadhaar number
        firebaseApp.database().ref('/uidai/').orderByChild('aadhaar_no').equalTo(this.state.aadhaar).once('value').then(function(snapshot) {
        
        snapshot.forEach(function(child){
            var value = child.val()

            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container'); 
            
            //send OTP to the phone number
            firebaseApp.auth().signInWithPhoneNumber("+91"+value.phone, window.recaptchaVerifier)
                .then(function(confirmationResult) { //wait for OTP verification
                window.confirmationResult = confirmationResult; 
                
                })
            })           
        })

    }

    //link aadhaar to account address using Smart Contract
    linkAadhaar(){
        this.state.web3.eth.getAccounts((error, accounts) => {
       
            this.RecordUploaderContract.methods.link(this.state.aadhaar).send(
                {from:accounts[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))}, function(error, txHash){
                  
                if(!error)
                {                   
                    alert('Transaction Hash:'+txHash)
                }
                  
                else
                    console.log(error)
                }) 
            })       
    }

    //confirm OTP function and call to linkAadhaar function
    myFunction = function() {
         
        let callLinkAadhaar = this.linkAadhaar        
      
        window.confirmationResult.confirm(document.getElementById("verificationcode").value) 
            .then(function(result) {       
            alert('signup process successfull!\n redirecting');
           
            callLinkAadhaar()
                window.location.href = '/signin'

            }, 

            function(error) { 
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
                        /><br/>
                        
                        <input
                            className="btn btn-primary"
                            type="submit"/>  
                        </form>
            
                              {/* // const contract = require('truffle-contract')
    // const simpleStorage = contract(SimpleStorageContract)
    // simpleStorage.setProvider(this.state.web3.currentProvider)
  
    // // Get accounts
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     this.simpleStorageInstance = instance
    //     this.setState({ account: accounts[0] })
    //     // Get the value from the contract to prove it worked.
    //     return this.simpleStorageInstance.get.call(accounts[0])
    //   }).then((ipfsHash) => {
    //     // Update state with the result.
    //     return this.setState({ ipfsHash })
    //   })
    // })
  //} */}
            
                    <br></br>
                    <br></br>
                    <div id="recaptcha-container"></div>
                    <br></br>
                    <br></br>
                        <form>
                        <input type="text" id="verificationcode"  /><br></br>
                            <input
                            className="jj" 
                            type="submit" 
                            className="btn btn-primary" 
                            value="Submit" onClick={this.myFunction} 
                        />
                    </form>
                  
                    <div><Link to={'/signin'}>Already Signed Up? Sign In Here</Link></div>
                </div>
            </div>
        )
    }
}

export default Signup;