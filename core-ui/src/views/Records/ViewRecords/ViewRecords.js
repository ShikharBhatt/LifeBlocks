import React, { Component } from 'react'
import ipfs from '../../../Dependencies/ipfs'
import {decrypt} from '../../../Dependencies/crypto'
import { getKeys,keyDecrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';



export class ViewRecords extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        ipfs : '',
        buffer: null,
        userAddress : '',
        recordsId :[],
        arr: [],
        selectValue: '',
        masterkey: '',
        newHash:'',
        value:'',
        web3:null,
        primary: false,
      };
  
      
        this.createSelectList = this.createSelectList.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.Change = this.Change.bind(this);
        this.view = this.view.bind(this);
        this.TableBody = this.TableBody.bind(this);
        this.togglePrimary = this.togglePrimary.bind(this);
      }


      async componentWillMount() {

       
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
                await getWeb3
                .then(results => {
          this.setState({
            web3: results.web3
          })
    
          // Instantiate contract once web3 provided.
        })
        .catch(() => {
          console.log('Error finding web3.')
          
        })
      
        await this.instantiateContract()

    
      }


     instantiateContract() {
  

      //Record Uploader Contract Instantiation
      const contractAddress = '0xf5e9037A2412db50c74d5A1642D6d3B99Dd90f20'
      const ABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"ipfsHash","type":"string"},{"name":"rtype","type":"string"},{"name":"rname","type":"string"},{"name":"Hospital","type":"address"},{"name":"masterkey","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"RecordtoOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"OwnerRecordCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"viewRecord","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"retrieve","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfsHash","type":"string"},{"name":"_type","type":"string"},{"name":"_name","type":"string"},{"name":"_masterkey","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]    
      var RecordUploaderContract = new this.state.web3.eth.Contract(ABI, contractAddress)      
      this.RecordUploaderContract = RecordUploaderContract
        

      //User Details Contract Instantiation
      const contractAddress_u = '0x78478e7666bcb38b2ddeddfe7cb0ba152301df07'       
      const ABI_u = [{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"aadhaarToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfskey","type":"string"}],"name":"link","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressToAadhaar","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getKeyHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_aadhaar","type":"uint256"}],"name":"addressLinked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_ipfshash","type":"string"}],"name":"keyLinked","type":"event"}]              
      var UserContract = new this.state.web3.eth.Contract(ABI_u, contractAddress_u)     
      this.UserContract = UserContract

      console.log("User Contract: "+ this.UserContract)

      //Get account from metamask
          this.state.web3.eth.getAccounts((error,account) => {
          if(!error) {
            console.log(account[0])
          }

          //get aadhaar value stored in Session
        let aadhaar = sessionStorage.getItem('aadhaar')
        let address = account[0]
        // alert(aadhaar)

        //Retrieve record id's for the user
        this.RecordUploaderContract.methods.retrieve(aadhaar).call(
            {from:account[0]}, function(error, x){
                
                this.setState({
                    recordsId : x
                })
                console.log(x)

                if(x === null) {
                  alert("No records found")
                }

                else if(x.length!=0) {
                  let myarray = []

                  for(let i = 0; i<x.length; i++) {
                    this.RecordUploaderContract.methods.viewRecord(x[i]).call(
                      {from:address}, function(error, y){
                        // alert('called')
                        let obj = {
                          // name: y[2],
                          // type: y[1],
                          // hospital: y[3]
                        }
                        obj['ipfsHash'] = y[0]
                        obj['name'] = y[2]
                        obj['type'] = y[1]
                        obj['hospital'] = y[3]
                        obj['masterkey'] = y[4]
                        
                        
                        myarray.push(obj)
                        
                        // alert("Objec"+myarray[0].name + myarray[0].type)
                        
                        this.setState({
                          arr: myarray
                        })  
                      }.bind(this))
      
                  }
                
                  // console.log(JSON.parse(myarray))
                  
                  // alert(myarray[0].name)
                  // alert(myarray[1].name)
                }
                else {
                  alert("No records found")
                }

              
            }.bind(this))
        })              
      }

      togglePrimary() {
        this.setState({
          primary: !this.state.primary,
        });
      }

      TableBody(recordsId) {

        const rows = recordsId.map((row, index) => {
              return (
                  <tr key={index}>
                      <td>{this.state.arr[index].name}</td>
                      {/* <td>{row.job}</td> */}
                      <td></td>
                      <td>{this.state.arr[index].type}</td>
                      <td>{this.state.arr[index].hospital}</td>
                      <td>
                        <Button
                        block color="primary" 
                        size="lg"
                        value={row} 
                        onClick=
                          {() => 
                            {
                              this.setState({value:row}, function(){
                              this.view(this.state.arr[index].ipfsHash, this.state.arr[index].masterkey)

                            })
                                  
                            }}
                          ><b>View</b></Button></td>
                  </tr>
                  
                  );
          
          });
      
          return rows
      }
    
    view(ipfs_hash,masterkey) {
      let un_mkey,keyObj,decrypted
      let myaadhaar = sessionStorage.getItem('aadhaar')
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
              this.UserContract.methods.getKeyHash(myaadhaar).call(
                {from:account[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))}).then((ipfsHash) => {
                    //get pgp key from ipfs
                    getKeys(ipfsHash, function(key){
                        keyObj = JSON.parse(key)
                        console.log("key object: " +keyObj)
                        console.log("key obj properties: "+Object.getOwnPropertyNames(keyObj))
                        //call to function to decrypt masterkey using pgp private key
                        keyDecrypt(keyObj,masterkey,"sumit",function(plain){
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
    
    // this.state.web3.eth.getAccounts((error,account) => {
    //   if(!error) {
    //     console.log(account[0])
    //   }
    // this.RecordUploaderContract.methods.retrieve(myaadhaar).call(
    //     {from:account[0]}, function(error, x){
            
    //         this.setState({
    //             recordsId : x
    //         })
    //         alert('State : '+ this.state.recordsId)
    //         alert('Length : '+ this.state.recordsId.length)
    //         alert('Value : '+ this.state.recordsId[0])
            
    //         alert("Loo[p")
    //         for(let i=0;i<this.state.recordsId.length;i++) {
    //           console.log("contract:",this.RecordUploaderContract)
    //           this.RecordUploaderContract.methods.viewRecord(this.state.value).call(
    //             {from:this.state.userAddress}, function(error, x){
    //               alert('called')
    //               obj.name = x[2]
    //               obj.date = "date"
    //               obj.type = x[1]
    //               obj.hospital = x[3]
    //               console.log(obj)
    //               temp.push(obj)
    //             }.bind(this))
    //            this.setState({
    //              arr: temp
    //            }) 
    //         }
    //     }.bind(this))
    //  })
    // alert("Name:"+this.recordArray[0].name)
    // let items = [];         
    //  for (let i = 0; i < this.state.recordsId.length; i++) {             
    //       items.push(
    //       <option key={this.state.recordsId[i]} value={this.state.recordsId[i]}>{this.state.recordsId[i]}
          
    //       </option>);   
    //       //here I will be creating my options dynamically based on
    //       //what props are currently passed to the parent component
    //  }
    //  return items;
     
 }  
  
 
    
    Change(event){
        this.setState({
            value : event.target.value
        })

        alert(event.target.value)
    }
  
   render() {
     if(this.state.arr.length === 0) {
       return <div></div>
     }
     else if(this.state.arr.length > 0){
      console.log("Athis.state.arr", this.state.arr)
      return (
        <div className="animated fadeIn">
        {/* <Button color="primary" onClick={this.togglePrimary} className="mr-1">Primary modal</Button>
                <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                       className={'modal-primary '}>
                  <ModalHeader toggle={this.togglePrimary}>Modal title</ModalHeader>
                  <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.togglePrimary}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.togglePrimary}>Cancel</Button>
                  </ModalFooter>
                </Modal> */}
       <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <h2>My Records: {this.state.recordsId.length}</h2>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                  <tr>
                    <th>Record Name</th>
                    <th>Date Generated</th>
                    <th>Record Type</th>
                    <th>Hospital Name</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                 
                  {/* <this.TableBody id="check" recordsId={this.state.recordsId} recordArray={this.state.arr}/> */}
                  {/* {this.createSelectList()}                   */}
                  {this.TableBody(this.state.arr)}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          </Row>
          <Row id ="itemPreview">
              <p>Your Record:</p>
              
          </Row>
          </div>
      //     <main className="container">
      //       <div className="pure-g">
      //         <div className="pure-u-1-1">

      //           <h2>View My Health Records</h2>
      //           {/* <form onSubmit={this.onSubmit}>
      //               <select id="select" value={this.state.value} onChange={this.Change}>
      //               <option value=""  disabled selected>Select Record</option>
      //  {this.createSelectList()}
      //               </select>
      //               <br></br>
      //               <input type='submit' />
      //           </form>
      //            */}
             
      //          </div>
      //       </div>
      //     </main>
    
      );

     }
    }
  }
  

  export default ViewRecords;