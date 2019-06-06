
import React, { Component } from 'react'
import { Link, BrowserRouter, Route, Redirect } from "react-router-dom";
import { getKeys,keyDecrypt, keyEncrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, storage, organization, policy} from "../../../contract_abi";
import { FormGroup, Input, Form, Card, CardBody, CardHeader, CardFooter, Col, Row, Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


class SharePolicy extends Component {
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
        this.shareRecords = this.shareRecords.bind(this);

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

      const policyContractAddress = sessionStorage.getItem('addressPolicy')       
      const policyABI = policy.abi              
      var policyContract = new this.state.web3.eth.Contract(policyABI, policyContractAddress)     
      this.policyContract = policyContract

      await this.state.web3.eth.getAccounts((error,account) => {
        if(!error) {
          console.log(account[0])
        }

        //get aadhaar value stored in Session
      let aadhaar = sessionStorage.getItem('aadhaar')
      let address = account[0]
      // alert(aadhaar)

      //Retrieve record id's for the user
       this.storageContract.methods.retrieve(aadhaar).call(
          {from:account[0]}, (error, x)=>{
              
              this.setState({
                  recordsId : x
              })
              console.log("Record:",x)

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
                  this.storageContract.methods.viewRecord(x[i]).call(
                    {from:address}, (error, y)=>{
                      // alert('called')
                      let obj = {

                      }
                      obj['recordId'] = x[i]
                      obj['ipfsHash'] = y[0]
                      obj['name'] = y[2]
                      obj['type'] = y[1]
                      let f = Number(y[3])
                      obj['date'] = new Date(f*1000).toLocaleDateString()
                      obj['hospital'] = y[4]
                      obj['masterkey'] = y[5]
                    
                      //push the record object into array of objects                        
                      myarray.push(obj)
                      
                      this.setState({
                          arr: myarray
                      })
                    })
    
                }
              
              }
              else {
                alert("No records found")
              }

            
          })
      })              
                  
      }


      //creating table for sharing the records
      displayRecords(recordsId) {
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
                          value={index}
                          onChange={this.onChange.bind(this)}
                        />
                      </td>
                  </tr>
                  
                  );
          
          });
          
          //return the table of records
          return rows
      }

     
      //create list of checked records
      onChange(e) {
        // current array of options
        const options = this.state.selectedRecords
        let index
    
        // check if the check box is checked or unchecked
        if (e.target.checked) {
          // add the numerical value of the checkbox to options array
          options.push(+e.target.value)
        } else {
          // or remove the value from the unchecked checkbox from the array
          index = options.indexOf(+e.target.value)
          options.splice(index, 1)
        }
    
        // update the state with the new array of options
        this.setState({ selectedRecords: options }, ()=>{
          console.log("Records: ",this.state.selectedRecords)
        })
      }


      async shareRecords(event) {
        event.preventDefault()
        if(this.state.selectedRecords.length>0) {
          let keyObj, keyObjOrg,seedphrase, selectedRecords
          let recordData = []
          
          let  m_key = []
          let myaadhaar = sessionStorage.getItem('aadhaar')
          let policyContract = this.policyContract
          let UserContract = this.UserContract
          let organizationAddress = sessionStorage.getItem('addressCompany')
          console.log("Organization:", organizationAddress)
          let account 
          let gp = this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))
          let gasL = this.state.web3.utils.toHex(4700000)
          recordData = this.state.arr
          console.log(recordData)
          seedphrase = this.state.seedphrase
          selectedRecords = this.state.selectedRecords

          await this.state.web3.eth.getAccounts((error, accounts) => {
            //transaction to link aadhaar card to address
            account = accounts[0]
            this.orgContract.methods
              .getKeyHash(organizationAddress)
              .call({
                from: accounts[0],
                gasPrice: gp,
              })
              .then( (pgpIpfsHashOrg) => {
                 getKeys(pgpIpfsHashOrg,  function (key) {
                  //in callback function of getKeys
                  keyObjOrg = JSON.parse(key);
                  //console.log(this.state.aadhaar)

                  UserContract.methods.getKeyHash(myaadhaar).call(
                    {from:account,gasPrice:gp}).then( (pgpIpfsHash) => {
                        //get pgp key from ipfs
                         
                           getKeys(pgpIpfsHash,  async function(key){
                            keyObj = JSON.parse(key)
                            //call to function to decrypt masterkey using pgp private key
                            for(let i=0;i<selectedRecords.length;i++) {
                              let data = recordData[selectedRecords[i]].recordId
                              console.log("Record id(-):",data)
                               await keyDecrypt(keyObj,recordData[selectedRecords[i]].masterkey,seedphrase, async function(plain){
                                let un_mkey = plain
                                  await keyEncrypt(un_mkey, keyObjOrg,  function (cipher) {
                                  //in callback function of keyEncrypt
                                  m_key.push(cipher);
                                  console.log("encrypted masterkey: " + cipher);
                                  console.log(account)


                                   policyContract.methods
                                  .getRecordsApplied(data, cipher )
                                  .send(
                                    {
                                      from: account,
                                      gasPrice: gp,
                                      gas:gasL
                                    },
                                    function(error, txHash) {
                                      if (!error) {
                                        console.log("tx: " + txHash);

                                       
                                      } else console.log(error);
                                    }
                                  );
                                })
                                               
                            })
                            }
                        })
                        // .then(() => {

                        //     policyContract.methods
                        //     .applyPolicy()
                        //     .send(
                        //       {
                        //         from: account,
                        //         gasPrice: gp,
                        //         gas:gasL
                        //       },
                        //       function(error, txHash) {
                        //         if (!error) {
                        //           console.log("tx: " + txHash);

                                 
                        //         } else console.log(error);
                        //       }
                        //     );
                        // })
                        
                        //end get keys
                        
                        
                    })
                });
              });
      
        
          });

         

            policyContract.methods
            .applyPolicy()
            .send(
              {
                from: account,
                gasPrice: gp,
                gas:gasL
              },
              function(error, txHash) {
                if (!error) {
                  console.log("tx: " + txHash);

                 
                } else console.log(error);
              }
            );
        
        

          

        }

      }

  
   render() {
     //don't render if there are no records for the user
     if(this.state.arr.length === 0) {
       return <div>Loading...</div>
     }

     //render if the user has records
     else if(this.state.arr.length > 0){
      console.log("Athis.state.arr", this.state.arr)
      return (
        <div className="animated fadeIn">
        <Form
                    onSubmit={this.shareRecords}
                    method="post"
                    encType="multipart/form-data"
                    className="form-horizontal"
                  >
       <Row>
          <Col xs="12" lg="12">
          <Button className="icon-arrow-left-circle icons font-2xl d-block mt-4" style={{color:'red', backgroundColor:'transparent', border:'transparent'}} onClick={()=>{window.location.reload(true)}}></Button>
            <Card>
              <CardHeader>
                <h2>Share Records:</h2>
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
                    {this.displayRecords(this.state.arr)}
                  </tbody>
                </Table>
              

              <FormGroup row>
                <Col xs="12" md="6">
                <Input
                    style={{border:'1px solid red'}}
                    type="password"
                    placeholder="Enter seedphrase"
                    onChange={event => this.setState({ seedphrase: event.target.value })}          
                    required={true}      
                  />
                  </Col>
                </FormGroup>

                  </CardBody>
                  <CardFooter className="p-4">
                  <Row>
                    
                        <Col xs="3" sm="3" md="2">
                      
                      
                      <Button id="shareButton"
                      className="btn-facebook mb-1" block
                      block color="primary" 
                      size="sm"
                      
                      type="submit"
                        ><b><span>Share</span></b></Button>
                    </Col>
                  </Row>
                </CardFooter>
            </Card>
          </Col>
          </Row>
          </Form>
        </div>    
      );

     }
    }
  }
  

  export default SharePolicy; 