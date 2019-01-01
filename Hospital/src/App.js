import React, { Component } from 'react'
import ipfs from './ipfs'
import crypt from'./crypto'
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
      aadhaar :'',
      type : '',
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
    const contractAddress = '0x83C7F9415C49eF48e51682c0feB4549bb465aB69'
    const ABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"ipfsHash","type":"string"},{"name":"rtype","type":"string"},{"name":"Hospital","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"RecordtoOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"OwnerRecordCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"viewRecord","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhar","type":"uint256"}],"name":"retrieve","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhar","type":"uint256"},{"name":"_ipfsHash","type":"string"},{"name":"_type","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    //console.log('constract Address : ',contractAddress)
    var RecordUploaderContract = new web3.eth.Contract(ABI, contractAddress)
    //console.log(RecordUploaderContract)
    this.RecordUploaderContract = RecordUploaderContract
    
    // const contract = require('truffle-contract')
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
      [event.target.name]:event.target.value, 
    });
  }

  onSubmit(event) {

    event.preventDefault()
   
   
    ipfs.files.add(this.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }

      alert('Aadhaar : '+ this.state.aadhaar + '\nIPFSHash : '+ result[0].hash + '\nType : '+ this.state.type)
      const txBuilder = this.RecordUploaderContract.methods.upload(
        this.state.aadhaar,
        result[0].hash,
        this.state.type);
  
        let encoded_tx = txBuilder.encodeABI();
        var addrHosp = "0xFB23cd312F5Da28dAeD5E6c7D76DA1c2Cf9c977F"
        var privHosp = "0x05dd9541d286146c393a60ea7f23d7f8ed14abd84728c00419d9cfbb2493f140"
        web3.eth.getTransactionCount(addrHosp, (err , txCount) => {
          //Transaction Object
          const txObject = {
              nonce : web3.utils.toHex(txCount),
              from:addrHosp,
              to: "0x83C7F9415C49eF48e51682c0feB4549bb465aB69",         //all paramters should be in Hex
              gasLimit : web3.utils.toHex(4700000),
              gasPrice : web3.utils.toHex(web3.utils.toWei('0','gwei')),
              data : encoded_tx
          }
          web3.eth.accounts.signTransaction(txObject, privHosp, function (error, signedTx) {
           
              web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                      .on('receipt', function (receipt) {
                          console.log(receipt.transactionHash)
                  })
        
     
          })
      })
      // this.RecordUploaderContract.methods.sendHash(result[0].hash,this.state.userAddress).send(
      //   {from:this.state.currentAccount,gas : 4700000,gasPrice:web3.utils.toHex(web3.utils.toWei('100','gwei'))}, function(error, txHash){
      //     alert('Transaction Hash:'+txHash)
      //   })
   

    }) 
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
              <h1>Your Image</h1>
              <p>This image is stored on IPFS & The Ethereum Blockchain!</p>
              <h2>My Hospital</h2>
              <form onSubmit={this.onSubmit} >
                <label>Enter User Aadhaar :</label><br/> 
                  <input 
                    type='text' 
                    name="aadhaar"
                    value={this.state.aadhaar}
                    onChange={this.handleInputChange}
                    autoComplete="false" 
                  required/>
                  <br /><br/> 
                  <label>Upload Record:</label><br/>
                <input type='file' onChange={this.captureFile} />
                <br /><br/> 
                <label>Enter Type of Record :</label><br/> 
                  <input 
                    type='text' 
                    name="type"
                    value={this.state.type}
                    onChange={this.handleInputChange}
                    autoComplete="false" 
                  required/>
                  <br/>
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
