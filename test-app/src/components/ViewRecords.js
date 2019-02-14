import React, { Component } from 'react'
// import '../css/oswald.css'
// import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import ipfs from '../ipfs'
import {decrypt} from '../crypto'
import { getKeys,keyDecrypt } from '../pgp';
import getWeb3 from '../utils/getWeb3'



export class ViewRecords extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        name : '',
        password: '',
        aadhaar : '',
        phone : '',
        publicKey:'',
        ipfs : '',
        buffer: null,
        userAddress : '',
        recordsId :[],
        selectValue: '',
        masterkey: '',
        newHash:'',
        value:''
      };
  
      
 //     this.onSignUp = this.onSignUp.bind(this);
   //   this.handleSignUpChange = this.handleSignUpChange.bind(this);
   //   this.onSubmit = this.onSubmit.bind(this);
        this.createSelectList = this.createSelectList.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.Change = this.Change.bind(this);
        this.view = this.view.bind(this);
        this.TableBody = this.TableBody.bind(this);

      }
    TableBody = (props) => {
        const rows = props.recordsId.map((row, index) => {
            return (
                <tr key={index}>
                    <td>{row}</td>
                    {/* <td>{row.job}</td> */}
                    <td><button
                            value={row} 
                        onClick=
                            {() => {
                                this.setState({value:row}, function(){
                                    this.onSubmit()

                                })
                                
                            }}
                        
                        >View</button></td>
                </tr>
                );
        
        });
    
        return <tbody>{rows}</tbody>
    }
    
    view(ipfs_hash,masterkey)
    {
      let un_mkey,keyObj,decrypted
      // call to ipfs api to retrieve file
      ipfs.cat(ipfs_hash,(err,file) => {
          if(err){
              throw err;
          }
          //print retrieved file
          console.log("file retrieved: " + file)
          console.log("file retrieved type: " + typeof file)

          //get metamask account address 
          this.state.web3.eth.getAccounts((error,account) => {
              console.log(account[0])
              //call to contract to get ipfs hash of pgp key of the user
              this.UserContract.methods.getKeyHash(7911755205).call(
                {from:account[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))}).then((ipfsHash) => {
                    //get pgp key from ipfs
                    getKeys(ipfsHash, function(key){
                        keyObj = JSON.parse(key)
                        console.log("key object: " +keyObj)
                        console.log("key obj properties: "+Object.getOwnPropertyNames(keyObj))
                        //call to function to decrypt masterkey using pgp private key
                        keyDecrypt(keyObj,masterkey,"create_keypair",function(plain){
                            un_mkey = plain
                            console.log("unencrypted masterkey : "+un_mkey)
                            let file_string = Buffer.from(file,'hex')
                            console.log("file_string: "+file_string)
                            console.log("file_string type: "+ typeof file_string)
                            decrypt(file_string,un_mkey,function(decrypted){
                                console.log("decrypted file: "+decrypted)

                            document.getElementById('itemPreview').innerHTML = '<pre>'+decrypted+'</pre>'
                            })
                            
                        })
                    })
                })
          })
      })

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


      const contractAddress = '0xf5e9037A2412db50c74d5A1642D6d3B99Dd90f20'
      const ABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"ipfsHash","type":"string"},{"name":"rtype","type":"string"},{"name":"rname","type":"string"},{"name":"Hospital","type":"address"},{"name":"masterkey","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"RecordtoOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"OwnerRecordCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"viewRecord","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"retrieve","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfsHash","type":"string"},{"name":"_type","type":"string"},{"name":"_name","type":"string"},{"name":"_masterkey","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]    
      //console.log('constract Address : ',contractAddress)
      var RecordUploaderContract = new this.state.web3.eth.Contract(ABI, contractAddress)
      //console.log(RecordUploaderContract)
      this.RecordUploaderContract = RecordUploaderContract
        

      const contractAddress_u = '0x78478e7666bcb38b2ddeddfe7cb0ba152301df07'
        
      const ABI_u = [{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"aadhaarToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfskey","type":"string"}],"name":"link","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressToAadhaar","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getKeyHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_aadhaar","type":"uint256"}],"name":"addressLinked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_ipfshash","type":"string"}],"name":"keyLinked","type":"event"}]
               
      var UserContract = new this.state.web3.eth.Contract(ABI_u, contractAddress_u)
      
      this.UserContract = UserContract

      console.log("User Contract: "+ this.UserContract)
  
     // var add = '0xF1CB5385a4632bD7565E4bEFCdE129c4DF4d400f'
        this.setState({
            userAddress : "0xFE4a659639fd0b385d852a8a6f57046Dc8a99fBE",
            aadhaar : '1234567890'
        });

        this.RecordUploaderContract.methods.retrieve(7911755205).call(
            {from:this.state.userAddress}, function(error, x){
                
                this.setState({
                    recordsId : x
                })
                alert('State : '+ this.state.recordsId)
                alert('Length : '+ this.state.recordsId.length)
                alert('Value : '+ this.state.recordsId[0])
            }.bind(this))

            
    }
  
    onSubmit(){
//        event.preventDefault();
// this.setState({
//     value:val
// })
        alert("Value:"+this.state.value)
        this.RecordUploaderContract.methods.viewRecord(this.state.value).call(
            {from:this.state.userAddress}, function(error, x){
              alert('called')
                this.setState({
                    ipfs : x[0],
                    masterkey : x[4]
                })
                alert('ipfs : '+x[0]+ 'masterkey :'+x[4])
                this.view(this.state.ipfs, this.state.masterkey)
            }.bind(this))

        
    }
    createSelectList(){
    
     //var x = document.getElementById("mySelect");
    // var length = this.state.recordsId.length;
    // var option ;
    // for(let i=0;i < length; i++){
    //     option = document.createElement("option");
    //     option.text =  this.state.recordsId[i];
    //     option.value =  this.state.recordsId[i];
    //     x.add(option);
    // }

    let items = [];         
     for (let i = 0; i < this.state.recordsId.length; i++) {             
          items.push(<option key={this.state.recordsId[i]} value={this.state.recordsId[i]}>{this.state.recordsId[i]}</option>);   
          //here I will be creating my options dynamically based on
          //what props are currently passed to the parent component
     }
     return items;
     
 }  
  
 
    
    Change(event){
        this.setState({
            value : event.target.value
        })

        alert(event.target.value)
    }
  
    render() {
      return (
       
  
          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">

                <h2>View My Health Records</h2>
                {/* <form onSubmit={this.onSubmit}>
                    <select id="select" value={this.state.value} onChange={this.Change}>
                    <option value=""  disabled selected>Select Record</option>
       {this.createSelectList()}
                    </select>
                    <br></br>
                    <input type='submit' />
                </form>
                 */}
                 <this.TableBody recordsId={this.state.recordsId}/>
               <p>Your Record:</p>
              <div id="itemPreview" ></div>
               </div>
            </div>
          </main>
    
      );
    }
  }
  

  export default ViewRecords;