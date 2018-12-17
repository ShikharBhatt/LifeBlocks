import React, { Component } from 'react'
//import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
const Web3 = require('web3')
const web3 = new Web3('http://localhost:7545')

console.log(web3)


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      currentAccount:null,
      userAddress : '',
    };
    
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const contractAddress = '0x0D41F1ea976B3a7A9371EC2ce4A5AAfdBfb1aa31'
    const ABI = [{"constant":false,"inputs":[{"name":"ipfs","type":"string"},{"name":"tosend","type":"address"}],"name":"sendHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"accessRecords","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"setPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_hospital","type":"address"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"hash","type":"string"}],"name":"SendHash","type":"event"}]
    console.log('constract Address : ',contractAddress)
    var RecordUploaderContract = new web3.eth.Contract(ABI, contractAddress)
    console.log(RecordUploaderContract)
    this.RecordUploaderContract = RecordUploaderContract
    
    this.state.web3.eth.getAccounts((error, accounts) => {       
      this.setState({ currentAccount: accounts[0] })  
  })
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.buffer = Buffer(reader.result)
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  handleInputChange(event){ 
    this.setState({
      userAddress:event.target.value, 
    });
    console.log(this.state.userAddress);
  }

  onSubmit(event) {

    event.preventDefault()
   
    console.log('user Address:', this.state.userAddress)
    

   
      this.RecordUploaderContract.methods.accessRecords(this.state.userAddress).call(
        {from:this.state.currentAccount}, function(error, ipfs){
          console.log('IPFS Hash : ',ipfs)
          return this.setState({ipfsHash:ipfs})
        }.bind(this))
        
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">IPFS File Upload DApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
             <h1>Insurance Company Interface</h1>
              <form onSubmit={this.onSubmit} >
                <label>Enter User Address :</label> 
                  <input 
                    type='text'  
                    name="userAddress"
                    value={this.state.userAddress}
                    onChange={this.handleInputChange}
                    autoComplete="false" 
                  required/>
                  <br />
                  
                <input type='submit' />
              </form>

              <h1>User's Record</h1>
              <p>This image is stored on IPFS & The Ethereum Blockchain!</p>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
