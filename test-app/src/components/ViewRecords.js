import React, { Component } from 'react'
// import '../css/oswald.css'
// import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import ipfs from '../ipfs'
import {decrypt} from '../crypto'
const Web3 = require('web3')
const web3 = new Web3('http://localhost:7545')



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
      ipfs.cat(ipfs_hash, function (err, file) {
        if (err) {
              throw err
            }
            console.log("file retrieved: " + file)
            console.log("file type: " + typeof file)
            //  console.log("file string version: " + file.toString('base64'))
            var decrypted = decrypt(file,masterkey)
            this.setState({
              newHash:decrypted
            })
// var data = [];
// for (var i = 0; i < decrypted.length; i++){  
//     data.push(decrypted.charCodeAt(i));
// }

//document.getElementById("itemPreview").src = "data:image/png;base64," + data

document.getElementById('itemPreview').innerHTML = '<pre>'+decrypted+'</pre>'
            console.log(" decrypted file:" + decrypted)
            console.log("file type: " + typeof decrypted)
        }.bind(this))
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


      const contractAddress = '0x83C7F9415C49eF48e51682c0feB4549bb465aB69'
      const ABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"ipfsHash","type":"string"},{"name":"rtype","type":"string"},{"name":"Hospital","type":"address"},{"name":"masterkey","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhar","type":"uint256"},{"name":"_ipfsHash","type":"string"},{"name":"_type","type":"string"},{"name":"_masterkey","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"RecordtoOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"OwnerRecordCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"viewRecord","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhar","type":"uint256"}],"name":"retrieve","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}]
      //console.log('constract Address : ',contractAddress)
      var RecordUploaderContract = new web3.eth.Contract(ABI, contractAddress)
      //console.log(RecordUploaderContract)
      this.RecordUploaderContract = RecordUploaderContract
        
     // var add = '0xF1CB5385a4632bD7565E4bEFCdE129c4DF4d400f'
        this.setState({
            userAddress : "0xFE4a659639fd0b385d852a8a6f57046Dc8a99fBE",
            aadhaar : '1234567890'
        });

        this.RecordUploaderContract.methods.retrieve(5361815322).call(
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
                    masterkey : x[3]
                })
                alert('ipfs : '+x[0]+ 'masterkey :'+x[3])
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