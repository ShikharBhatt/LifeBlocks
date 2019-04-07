import React, { Component } from 'react'
import ipfs from '../ipfs'
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import getWeb3 from '../utils/getWeb3'
import {encrypt,decrypt} from '../crypto'
import {keyEncrypt,getKeys} from '../pgp'

const Web3 = require('web3')
const web3 = new Web3('http://localhost:7545')

console.log(web3)


class Upload extends Component {
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
      rname:''
    };
    
    //this.captureFile = this.captureFile.bind(this);
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
     */                    //0xf5e9037a2412db50c74d5a1642d6d3b99dd90f20
    const contractAddress = '0xafb27a2deb77ca90ed435326904ca257635cbf2f'
    const ABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "lastContractAddress",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "policyContracts",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_position",
            "type": "uint256"
          }
        ],
        "name": "getContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getOwner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_coverage",
            "type": "uint256"
          },
          {
            "name": "_aadhaar",
            "type": "uint256"
          }
        ],
        "name": "newPolicy",
        "outputs": [
          {
            "name": "newPolicyContract",
            "type": "address"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getContractCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "policyContractAddress",
            "type": "address"
          }
        ],
        "name": "newPolicyPurchase",
        "type": "event"
      }
    ]
    //console.log('constract Address : ',contractAddress)
    var RecordUploaderContract = new this.state.web3.eth.Contract(ABI, contractAddress)
    //console.log(RecordUploaderContract)
    this.RecordUploaderContract = RecordUploaderContract
    console.log("upload contract: "+this.RecordUploaderContract)

    const contractAddress_u = '0x78478e7666bcb38b2ddeddfe7cb0ba152301df07'
        
    const ABI_u = [{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"aadhaarToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfskey","type":"string"}],"name":"link","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressToAadhaar","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getKeyHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_aadhaar","type":"uint256"}],"name":"addressLinked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_ipfshash","type":"string"}],"name":"keyLinked","type":"event"}]
             
    var UserContract = new this.state.web3.eth.Contract(ABI_u, contractAddress_u)
    
    this.UserContract = UserContract
    console.log("user contract:"+this.UserContract)
    
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

  // captureFile(event) {
  //   event.preventDefault()
  //   const file = event.target.files[0]
  //   const reader = new window.FileReader()
  //   reader.readAsArrayBuffer(file)
  //   reader.onloadend = () => {
  //     this.buffer = Buffer(reader.result)
  //     this.setState({ buffer: Buffer(reader.result) })
  //     console.log('buffer', this.state.buffer)
  //   }
  // }

  handleInputChange(event){ 
    this.setState({
      [event.target.name]:event.target.value, 
    });
  }

  onSubmit(event) {

    event.preventDefault()
    // console.log(this.buffer);
    // var encrypted = encrypt(this.buffer);
    // const masterkey = encrypted[0];
    // this.buffer = Buffer(encrypted[1]);
    // console.log(masterkey)
    // console.log(encrypted);
    // let keyObj,m_key,record

    //record = this.buffer
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.RecordUploaderContract.methods.newPolicy(4000,7911755205).send({from:accounts[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei')),value:this.state.web3.utils.toHex(this.state.web3.utils.toWei('1','ether'))}).then((contractAdd) => {
        console.log("Deployed Policy:"+ contractAdd)
      })
    })
    
}

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Hospital Record Upload</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h2>My Hospital</h2>
              <form onSubmit={this.onSubmit} >
                <label>Enter Coverage :</label><br/> 
                  <input 
                    type='text' 
                    name="aadhaar"
                    value={this.state.coverage}
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

export default Upload
