
import React, { Component } from 'react'
import ipfs from '../../../Dependencies/ipfs'
import {decrypt} from '../../../Dependencies/crypto'
import { getKeys,keyDecrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, storage} from "../../../contract_abi";
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


class ShareRecords extends Component {
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
  
      
        this.onSubmit = this.onSubmit.bind(this);
        this.Change = this.Change.bind(this);
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

                        obj['recordId'] = x[i]
                        obj['ipfsHash'] = y[0]
                        obj['name'] = y[2]
                        obj['type'] = y[1]
                        let f = Number(y[3])
                        obj['date'] = new Date(f*1000).toLocaleDateString()
                        console.log(y[3])
                        obj['hospital'] = y[4]
                        obj['masterkey'] = y[5]
                        
                        //push the record object into array of objects                        
                        myarray.push(obj)
                                                
                        this.setState({
                          arr: myarray
                        })  
                      }.bind(this))
      
                  }
                
                }
                else {
                  alert("No records found")
                }

              
            }.bind(this))
        })              
      }

      //function for modal
      togglePrimary() {
        this.setState({
          primary: !this.state.primary,
        });
      }


      //creating table for sharing the records
      TableBody(recordsId) {
        let ids = [];

        const rows = recordsId.map((row, index) => {
              return (
                  <tr key={index}>
                      <td>{this.state.arr[index].name}</td>
                      {/* <td>{row.job}</td> */}
                      <td>{this.state.arr[index].date}</td>
                      <td>{this.state.arr[index].type}</td>
                      <td>{this.state.arr[index].hospital}</td>
                      <td>
                        <input
                          type="checkbox"
                          id={this.state.arr[index].recordId}
                          // defaultChecked={this.state.chkbox}
                          onChange={function() {
                            console.log(document.getElementById(`${this.state.arr[index].recordId}`).checked);
                            if (document.getElementById(`${this.state.arr[index].recordId}`).checked) {
                              console.log("checked");
                              ids.push(`${this.state.arr[index].recordId}`);
                            } else {
                              ids = ids.filter(c => {
                                return c !== `${this.state.arr[index].recordId}`;
                              });
                            }
                            console.log(ids);
                          }.bind(this)}
                        />
                      </td>
                  </tr>
                  
                  );
          
          });
          
          //return the table of records
          return rows
      }
  
  
    onSubmit(){
        event.preventDefault();

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
                <h2>My Records</h2>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                  <tr>
                    <th>Record Name</th>
                    <th>Date Generated</th>
                    <th>Record Type</th>
                    <th>Hospital Name</th>
                    <th>Select Records</th>
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
            <Row id ="itemPreview">
                <p>Your Record:</p>
                
            </Row>
          </div>    
      );

     }
    }
  }
  

  export default ShareRecords;