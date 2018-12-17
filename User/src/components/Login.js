import React, { Component } from 'react'
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
const Web3 = require('web3')
const web3 = new Web3('http://localhost:7545')


export class Login extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        name : '',
        password: '',
        aadhaar : '',
        phone : '',
        publicKey:'',
       
        buffer: null,
        userAddress : '',
      };
  
      this.onLogin = this.onLogin.bind(this);
      this.handleLoginChange = this.handleLoginChange.bind(this);
    }
  
    componentWillMount() {
    
        // Instantiate contract once web3 provided.
        this.instantiateContract()
    }
  
    
    instantiateContract() {
      /*
       * SMART CONTRACT EXAMPLE
       *
       * Normally these functions would be called in the context of a
       * state management library, but for convenience I've placed them here.
       */
  
      const contractAddress = '0x0D41F1ea976B3a7A9371EC2ce4A5AAfdBfb1aa31'
      const ABI = [{"constant":true,"inputs":[{"name":"_aadhar","type":"uint256"}],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhar","type":"uint256"},{"name":"_password","type":"string"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"userInfo","outputs":[{"name":"name","type":"string"},{"name":"phone","type":"uint256"},{"name":"user","type":"address"},{"name":"password","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhar","type":"uint256"},{"name":"_name","type":"string"},{"name":"_phone","type":"uint256"},{"name":"_password","type":"string"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_type","type":"string"}],"name":"setType","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_aadhar","type":"uint256"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"accountType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"phone","type":"uint256"},{"indexed":false,"name":"aadhar","type":"uint256"}],"name":"addressLinked","type":"event"}]
     // console.log('constract Address : ',contractAddress)
      var UserDetailsContract = new web3.eth.Contract(ABI, contractAddress)
     // console.log(UserDetailsContract)
      this.UserDetailsContract = UserDetailsContract
      
    //   this.state.web3.eth.getAccounts((error, accounts) => {       
    //     this.setState({ currentAccount: accounts[0] })  
        
    // })
    // console.log('Current user Address:', this.state.currentAccount)
    }
  
  
    handleLoginChange(event){
  
      this.setState({
        [event.target.name]:event.target.value, 
      });
    }
  
   
  
    onLogin(event){
      event.preventDefault()
  
      alert('Public Key:'+ this.state.publicKey)
      this.UserDetailsContract.methods.login(this.state.aadhaar,this.state.password).call(
         {from:this.state.publicKey},function(error, x){
           if(error){
             alert('Wrong')
             return
           }
           if(x === true){
             alert('Login Successfull')
           }
           else{
             alert('Details Incorrect')
           }
        })
        this.setState({
          publicKey : '',
          password: '',
          aadhaar : '',
          
        });
    }
  
    render() {
      return (
       
  
          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                
              
                <h2>Login</h2>
                <form onSubmit={this.onLogin} >
                <label>Enter Public Key : </label> <br/>
                    <input 
                      type='text' 
                      name="publicKey"
                      value={this.state.publicKey}
                      onChange={this.handleLoginChange}
                      autoComplete="false" 
                    required/>
                    <br />
                  <label>Enter Aadhaar Number : </label> <br/>
                    <input 
                      type='number' 
                      name="aadhaar"
                      value={this.state.aadhaar}
                      onChange={this.handleLoginChange}
                      autoComplete="false" 
                    required/>
                    <br />
                    <label>Enter your Account Password : </label> <br/>
                    <input 
                      type='password' 
                      name="password"
                      value={this.state.password}
                      onChange={this.handleLoginChange}
                      autoComplete="false" 
                    required/>
                    <br />
                  <input type='submit' />
                </form>
              </div>
            </div>
          </main>
    
      );
    }
  }
  

  