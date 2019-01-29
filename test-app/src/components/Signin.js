import React, {Component} from 'react';
import {Link} from 'react-router';
import getWeb3 from '../utils/getWeb3'

class Signin extends Component{
    constructor(props){
        super(props);

        this.state={            //declaring state variables
            aadhaar:"",
            currentAddress:null
        }
        this.Signin = this.SignIn.bind(this)
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
    
    const contractAddress = '0x0d41f1ea976b3a7a9371ec2ce4a5aafdbfb1aa31'
    
    const ABI = [{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"key_ipfs","type":"string"}],"name":"keymap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"link","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"aadhaarToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_aadhaar","type":"uint256"}],"name":"addressLinked","type":"event"}]
    
    var RecordUploaderContract = new this.state.web3.eth.Contract(ABI, contractAddress)
    
    this.RecordUploaderContract = RecordUploaderContract
    
    // this.state.web3.eth.getAccounts((error, accounts) => {
       
    //     this.setState({ currentAddress: accounts[0] })  
    // })
    // console.log(this.state.currentAddress)
    
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