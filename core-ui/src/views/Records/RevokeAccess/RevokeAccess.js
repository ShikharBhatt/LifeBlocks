
import React, { Component } from 'react'
import ipfs from '../../../Dependencies/ipfs'
import { getKeys,keyDecrypt, keyEncrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, storage, organization, permissions} from "../../../contract_abi";
import { FormGroup, Input, Form, Card, CardBody, CardHeader, CardFooter, Col, Row, Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


class RevokeAccess extends Component {
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
        insuranceAdds:[],
        insuranceCompanies: [],
        insuranceAddress: null,
        seedphrase:null,
        selectedRecords: [],
      };
  
      
       
        this.displayRecords = this.displayRecords.bind(this);
        
        this.RevokeAccess = this.RevokeAccess.bind(this);
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


     async instantiateContract() {
  

      //Record Uploader Contract Instantiation
      const contractAddress = storage.contract_address
      const ABI = storage.abi    
      var storageContract = new this.state.web3.eth.Contract(ABI, contractAddress)      
      this.storageContract = storageContract
        

      //User Details Contract Instantiation
      const contractAddress_u = userdetails.contract_address       
      const ABI_u = userdetails.abi              
      var UserContract = new this.state.web3.eth.Contract(ABI_u, contractAddress_u)     
      this.UserContract = UserContract

      const orgContractAddress = organization.contract_address
      const orgABI = organization.abi
      var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
      this.orgContract = orgContract

      const permissionsContractAddress = permissions.contract_address
      const permissionsABI = permissions.abi
      var permissionsContract = new this.state.web3.eth.Contract(permissionsABI, permissionsContractAddress)
      this.permissionsContract = permissionsContract


      //Get account from metamask
      this.state.web3.eth.getAccounts((error,accounts) => {
        if(!error) {

          this.UserContract.methods.getAddress(sessionStorage.getItem('aadhaar')).call(
            {from: accounts[0]}, (error, address) => {
              if(!error) {
                if(address === accounts[0]) {
                    this.permissionsContract.methods.getPermissionList(accounts[0]).call(
                        {from: accounts[0]}, (error, id) => {
                          if(!error && id.length>0) {
                            this.setState({
                              ids: id
                            })
                            console.log(id)
                            let myarray = []
                            for(let i=0; i<id.length; i++) {
                              
                                this.permissionsContract.methods.permissionList(id[i]).call(
                                {from: accounts[0]}, async (error, data) =>{
                                    let obj = { }
                                    obj['permissionID'] = id[i]
                                    obj['recordId'] = data[2]
                                    obj['to'] = data[0]

                                    obj['status'] = data[4]
                                    
                                    if(data[4])
                                      obj['statusValue'] = "true"
                                    else {
                                      obj['statusValue'] = "false"
                                     
                                    }

                                    await this.orgContract.methods.getOrgName(data[0]).call(
                                      {from:accounts[0]}, function(error, orgname) {
                                        if(!error) {
                                          obj['orgName'] = orgname
                                        }
                                      }
                                    )

                                    this.storageContract.methods.getDetails(data[2]).call(
                                        {from:accounts[0]}, function(error, y){
                                            // alert('called')
                                            if(!error) {

                                              obj['name'] = y[1]
                                              obj['type'] = y[2]
                                              let f = Number(y[3])
                                              obj['date'] = new Date(f*1000).toLocaleDateString()
                                              obj['hospital'] = y[4]
                                              if(data[4]) {
                                                //push the record object into array of objects                        
                                                myarray.push(obj)
                                                
                                                // alert("Objec"+myarray[0].name + myarray[0].type)
                                                
                                                this.setState({
                                                arr: myarray
                                                })  

                                              }

                                            }
                                        }.bind(this))
                                })                                   
                            }
    
                          }
                          else
                            console.log(error)
                        })
        
                }
                else {
                  alert("Incorrect Details! Please re-check the account in your metamask")
                }
              }
            })


        }
        else {
           console.log(error)
        }
 
      })
      

                    
      }


      RevokeAccess(recordId) {
      //Get account from metamask
      this.state.web3.eth.getAccounts((error,accounts) => {
        if(!error) {

          this.UserContract.methods.getAddress(sessionStorage.getItem('aadhaar')).call(
            {from: accounts[0]}, (error, address) => {
              if(!error) {
                if(address === accounts[0]) {
                    this.permissionsContract.methods.revoke(recordId).send(
                        {
                          from: accounts[0],
                          gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))
                        }, function(error, txHash)  {
                          if(!error) {
                            alert("Transaction Hash:" + txHash)
                            var btn = document.getElementById(this.state.value);
                            btn.innerHTML = "Revoked";
                            btn.disabled = true;

                          }
                          else
                            console.log(error)
                        }.bind(this))
        
                }
                else {
                  alert("Incorrect Details! Please re-check the account in your metamask")
                }
              }
            })


        }
        else {
          // console.log(error)
        }
 
      })
      

        
      }

      //function for modal
      togglePrimary() {
        this.setState({
          primary: !this.state.primary,
        });
      }


      //creating table for sharing the records
      displayRecords(recordsId) {
        if(recordsId.length > 0) {
          const rows = recordsId.map((row, index) => {
            return (
                <tr key={index}>

                    <td>{this.state.arr[index].name}</td>
                    <td>{this.state.arr[index].orgName}</td>                     
                    <td>{this.state.arr[index].date}</td>
                    <td>{this.state.arr[index].type}</td>
                    <td>{this.state.arr[index].hospital}</td>
                    {/* <td>{this.state.arr[index].statusValue}</td> */}
                    <td><Button
                      id={index}
                      block className="btn btn-brand btn-youtube"
                      size="lg"
                      value={row} 
                      onClick=
                        {() => 
                          {
                            this.setState({
                              value: index
                            }, function() {
                              this.RevokeAccess(this.state.arr[index].permissionID)
                            })
                          }
                        }  
                        ><b>Revoke</b></Button></td>
                
                </tr>
                
                );
        
        });
        
        //return the table of records
        return rows

        }
      }


   render() {
     //don't render if there are no records for the user
     if(this.state.arr.length === 0) {
       return <div>No Records Shared</div>
     }

     //render if the user has records
     else if(this.state.arr.length > 0){
      console.log("Athis.state.arr", this.state.arr)
      return (
        <div className="animated fadeIn">
      
       <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <h2>Shared Record Details</h2>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                  <tr>
                    <th>Record Name</th>
                    <th>Permitted To</th>
                    <th>Date Generated</th>
                    <th>Record Type</th>
                    <th>Generated By</th>
                   
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.displayRecords(this.state.arr)}
                  </tbody>
                </Table>
                  </CardBody>
                  
            </Card>
          </Col>
          </Row>
          
        </div>    
      );

     }
    }
  }
  

  export default RevokeAccess;