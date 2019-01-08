import React, { Component } from 'react'
//import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')



class App extends Component {
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
    this.onSignUp = this.onSignUp.bind(this);
    this.handleSignUpChange = this.handleSignUpChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
  
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
    const ABI = [{"constant":true,"inputs":[{"name":"_aadhar","type":"uint256"}],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhar","type":"uint256"},{"name":"_password","type":"string"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"userInfo","outputs":[{"name":"name","type":"string"},{"name":"phone","type":"uint256"},{"name":"user","type":"address"},{"name":"password","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhar","type":"uint256"},{"name":"_name","type":"string"},{"name":"_phone","type":"uint256"},{"name":"_password","type":"string"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_type","type":"string"}],"name":"setType","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"accountType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"phone","type":"uint256"},{"indexed":false,"name":"aadhar","type":"uint256"}],"name":"addressLinked","type":"event"}]
    console.log('constract Address : ',contractAddress)
    var UserDetailsContract = new web3.eth.Contract(ABI, contractAddress)
    console.log(UserDetailsContract)
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

  handleSignUpChange(event){
    
    this.setState({
      [event.target.name] : event.target.value,
    });
  }

  onSignUp(event){
    event.preventDefault();
   alert('Name : '+ this.state.name+ '\nAadhaar : '+this.state.aadhaar +'\nPassword :' + this.state.password)

    var passHash = web3.utils.keccak256(this.state.password)  //generate hash for the password

    alert('Pass hash : '+ passHash)


  var result = web3.eth.accounts.create()   //create the account for the user
    this.setState({
      password: passHash,
    });
   this.publicKey = result.address
  
   console.log('Public Key : '+ result.address + '\nPrivate key:' + result.privateKey)
  
    const txBuilder = this.UserDetailsContract.methods.setInfo(
      this.state.aadhaar,
      this.state.name,
      this.state.phone,
      this.state.password);

      let encoded_tx = txBuilder.encodeABI();

      web3.eth.getTransactionCount(result.address, (err , txCount) => {
        //Transaction Object
        const txObject = {
            nonce : web3.utils.toHex(txCount),
            from:result.address,
            to: "0x0D41F1ea976B3a7A9371EC2ce4A5AAfdBfb1aa31",         //all paramters should be in Hex
            gasLimit : web3.utils.toHex(4700000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('0','gwei')),
            data : encoded_tx
        }
        web3.eth.accounts.signTransaction(txObject, result.privateKey, function (error, signedTx) {
          if (error) {
          console.log(error);
          // handle error
      } else {
  web3.eth.sendSignedTransaction(signedTx.rawTransaction)
          .on('receipt', function (receipt) {
              console.log(receipt.transactionHash)
       })
      }
   
        })
    })
    
    this.publicKey = ''
    this.setState({
      name : '',
      password: '',
      aadhaar : '',
      phone : '',
    });
  }

  
  onSubmit(event) {

    event.preventDefault()

    this.UserDetailsContract.methods.getInfo(1234567890).call(
      {from:this.publicKey}, function(error, x){
        alert('Name: '+x[0] + '\nPhone:'+x[1]+'\nUser Address:'+x[2])
      
      })  
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
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">My User Application</a>
          <a href="#" className="pure-menu-heading pure-menu-link">Login</a>
          <a href="#" className="pure-menu-heading pure-menu-link">SignUp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              
              <h2>SignUp</h2>
              <form onSubmit={this.onSignUp} autoComplete="off">
                <label>Name:</label><br/> 
                  <input 
                    type='text' 
                    name="name"
                    value={this.state.name}
                    onChange={this.handleSignUpChange}
                    autoComplete="false" 
                  required />
                  <br />
                  <label>Aadhaar Number :</label><br/> 
                  <input 
                    type='text'
                    name="aadhaar"
                    value={this.state.aadhaar}
                    onChange={this.handleSignUpChange}
                    autoComplete="false" 
                  required/>
                  <br />
                  <label>Phone</label><br/> 
                  <input 
                    type='number' 
                    name="phone"
                    value={this.state.phone}
                    onChange={this.handleSignUpChange}
                    autoComplete="false" 
                  required/>
                  <br />
                  <label>Password</label> <br/>
                  <input 
                    type='password' 
                    name="password"
                    value={this.state.password}
                    onChange={this.handleSignUpChange}
                    autoComplete="false" 
                  required/>
                  <br />
                  
                <input type='submit' /><br/>
              </form>
              {/* <form onSubmit={this.onSubmit}>
              <input type='submit' />
              </form> */}
              <br></br>
              <br></br>
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
      </div>
    );
  }
}

export default App
