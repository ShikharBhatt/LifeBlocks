import React, { Component } from 'react'
import ipfs from '../../../Dependencies/ipfs'
import {decrypt} from '../../../Dependencies/crypto'
import { getKeys,keyDecrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, storage} from "../../../contract_abi";
import { Badge, Input, Card, CardBody, CardHeader, Col, Row, Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';



export class ViewRecords extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        ipfs : '',
        buffer: null,
        userAddress : '',
        recordsId : [],
        arr: [],
        selectValue: '',
        //masterkey: '',
        newHash: '',
        value: '',
        web3: null,
        primary: false,
        seedphrase: null
      };
  
      
     
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
      const contractAddress = storage.contract_address
      const ABI = storage.abi    
      var RecordUploaderContract = new this.state.web3.eth.Contract(ABI, contractAddress)      
      this.RecordUploaderContract = RecordUploaderContract
        

      //User Details Contract Instantiation
      const contractAddress_u = userdetails.contract_address       
      const ABI_u = userdetails.abi              
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

                //if there are no records for the user
                if(x === null) {
                  alert("No records found")
                }

                //if record length is greater than 0
                else if(x.length!=0) {
                  let rid = []
                  
                  //convert the record string array to number array
                  for(let j = 0;j<x.length; j++) {
                    rid[j] = Number(x[j])
                  }

                  for(let j = 0;j<x.length; j++) {
                    x[j] = rid[j]
                  }

                  //sort the number array in descending order
                  x.sort(function(a, b){return b - a});

                  let myarray = []

                  //getting data of each record
                  for(let i = 0; i<x.length; i++) {
                    this.RecordUploaderContract.methods.viewRecord(x[i]).call(
                      {from:address}, function(error, y){
                        // alert('called')
                        let obj = {

                        }
                        obj['ipfsHash'] = y[0]
                        obj['name'] = y[2]
                        obj['type'] = y[1]
                        let f = Number(y[3])
                        obj['date'] = new Date(f*1000).toLocaleDateString()
                        console.log(y[3])
                        obj['hospital'] = y[4]
                        //obj['masterkey'] = y[5]
                        
                        //push the record object into array of objects                        
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

      //function for toggling the modal
      togglePrimary() {
        this.setState({
          primary: !this.state.primary,
        });
      }


      //creating table for displaying the records
      TableBody(recordsId) {

        const rows = recordsId.map((row, index) => {
              return (
                  <tr key={index}>
                      <td>{this.state.arr[index].name}</td>
                      {/* <td>{row.job}</td> */}
                      <td>{this.state.arr[index].date}</td>
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
                              this.view(this.state.arr[index].ipfsHash)

                            })
                                  
                            }}
                          ><b>View</b></Button></td>
                  </tr>
                  
                  );
          
          });
          
          //return the table of records
          return rows
      }
    
    //function to view record - includes decryption after fetching file from IPFS
    view(ipfs_hash) {
      let keyObj,decrypted,seedphrase
      let myaadhaar = sessionStorage.getItem('aadhaar')
      // call to ipfs api to retrieve file
      seedphrase = this.state.seedphrase

      if(!seedphrase) {
        alert("Please enter your seedphrase in the available text box")
      }

      else {
        ipfs.cat(ipfs_hash,(err,file) => {
          if(err){
            alert("In-Correct Seedphrase")
              throw err;
          }
          //print retrieved file
          console.log("file retrieved: " + file)
          console.log("file retrieved type: " + typeof file)
          this.setState({primary:true})// open the modal
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
                        keyDecrypt(keyObj,file,seedphrase,function(plain){
                            decrypted = plain
                            console.log("decrypted file : "+decrypted)
                            
                              
                            document.getElementById('itemPreview').innerHTML = '<pre>'+decrypted+'</pre>' // show data in modal
                            })
                            
                        })
                    })
                })
          })

      }

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
                    //masterkey : x[4]
                })
                alert('ipfs : '+x[0])
                this.view(this.state.ipfs)
            }.bind(this))
   
    }
    
    Change(event){
        this.setState({
            value : event.target.value
        })

        alert(event.target.value)
    }
  
   render() {
     //don't render if there are no records for the user
     if(this.state.arr.length === 0) {
       return <div></div>
     }

      //render if the user has records
     else if(this.state.arr.length > 0){
      
      return (
        <div className="animated fadeIn">
                <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                       className={'modal-primary '} size="xl">
                  <ModalHeader toggle={this.togglePrimary}>Record</ModalHeader>
                  <ModalBody id="itemPreview">
                  </ModalBody>
                </Modal> 
       <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <h2>My Records: {this.state.recordsId.length}
                </h2>
                <Input
                          type="password"
                          placeholder="Enter seedphrase"
                          onChange={event =>
                            this.setState({ seedphrase: event.target.value })
                          }
                          
                />
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
                    {this.TableBody(this.state.arr)}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          </Row>
          {/* <Row id ="itemPreview">
              <p>Your Record:</p>
              
          </Row> */}
          </div>
     
      );

     }
    }
  }
  

  export default ViewRecords;