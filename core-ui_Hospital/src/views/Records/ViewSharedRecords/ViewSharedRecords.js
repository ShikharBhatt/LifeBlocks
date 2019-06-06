import React, { Component } from 'react'
import ipfs from '../../../Dependencies/ipfs'
import {decrypt} from '../../../Dependencies/crypto'
import { getKeys,keyDecrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, storage, organization, permissions} from "../../../contract_abi";
import { Label, Form, FormGroup, Input, Card, CardBody, CardHeader, Col, Row, Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';



export class ViewSharedRecords extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        ipfs : '',
        aadhaar:null,
        buffer: null,
        userAddress : '',
        recordsId : [],
        arr: [],
        web3: null,
        primary: false,
        seedphrase: null,
        ids: [],
        pgpOrg:null,
        recordsAvailable: []
      };
  
      
     
        this.onSubmit = this.onSubmit.bind(this);
        this.Change = this.Change.bind(this);
        this.view = this.view.bind(this);
        this.TableBody = this.TableBody.bind(this);
        this.togglePrimary = this.togglePrimary.bind(this);
        this.getRecords = this.getRecords.bind(this);
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

      }

      //function for toggling the modal
      togglePrimary() {
        this.setState({
          primary: !this.state.primary,
        });
      }


      //creating table for displaying the records
      TableBody(recordsId) {
        if(recordsId.length>0) {
         document.getElementById("seedLabel").style.display = "inline-block"
         document.getElementById("seedPhrase").style.display = "inline-block"
            const rows = recordsId.map((row, index) => {
                return (
                    <tr key={index}>
                        <td>{this.state.arr[index].recordId}</td>
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
                                this.view(this.state.arr[index].ipfsHash, this.state.arr[index].masterkey)
  
                              })
                                    
                              }}
                            ><b>View</b></Button></td>
                    </tr>
                    
                    );
            
            });
            
            //return the table of records
            return rows
  
        }
      }
    
    //function to view record - includes decryption after fetching file from IPFS
    view(ipfs_hash,masterkey) {
      console.log(this.state.arr)
      let un_mkey,keyObj,decrypted,seedphrase
      seedphrase = this.state.seedphrase
      console.log(masterkey)
      if(!seedphrase) {
        alert("Please enter your seedphrase in the available text box")
      }

      else {
        // call to ipfs api to retrieve file
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
              this.orgContract.methods.getKeyHash(account[0]).call(
                {from:account[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))}
                ).then((ipfsHash) => {
                    //get pgp key from ipfs
                    console.log(ipfsHash)
                    getKeys(ipfsHash, function(key){
                        keyObj = JSON.parse(key)
                        console.log("key object: " +keyObj)
                        console.log("key obj properties: "+Object.getOwnPropertyNames(keyObj))
                        //call to function to decrypt masterkey using pgp private key
                        keyDecrypt(keyObj,masterkey,seedphrase,function(plain){
                            un_mkey = plain
                            console.log("unencrypted masterkey : "+un_mkey)
                            let file_string = Buffer.from(file,'hex')
                            console.log("file_string: "+file_string)
                            console.log("file_string type: "+ typeof file_string)
                            decrypt(file_string,un_mkey,function(decrypted){
                                console.log("decrypted file: "+decrypted)
                              
                            document.getElementById('itemPreview').innerHTML = '<pre>'+decrypted+'</pre>' // show data in modal
                            })
                            
                        })
                    })
                })
          })
      })
    }
  }

    onSubmit(){
        alert("Value:"+this.state.value)

        this.storageContract.methods.viewRecord(this.state.value).call(
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
    
    // componentDidMount() {
    //   document.getElementById("seedPhrase").disabled = "true"

    // }

    Change(event){
        this.setState({
            value : event.target.value
        })

        alert(event.target.value)
    }
    
     getRecords(event) {
        event.preventDefault()

          this.state.web3.eth.getAccounts((error,accounts) => {
            if(!error) {
                // this.setState({

                // })
              this.orgContract.methods.getOrgDetails(accounts[0]).call(
                {from: accounts[0]}, (error, details) => {
                  if(!error) {
                    console.log("Fetched org ID:", details[0])
                    if(details[2] === sessionStorage.getItem("orgId")) {
                        this.permissionsContract.methods.filterList(this.state.aadhaar).call(
                            {from: accounts[0]}, (error, id) => {
                              if(!error && id.length>0) {
                                this.setState({
                                  ids: id
                                })
                                console.log(id)
                                let myarray = []
                                for(let i=0; i<id.length; i++) {
                                  
                                    this.permissionsContract.methods.permissionList(id[i]).call(
                                    {from: accounts[0]}, (error, data) =>{
                                        let obj = { }
                                        obj['recordId'] = data[2]
                                        console.log("Masster kar: ", data[3])
                                        obj['masterkey'] = data[3]
                                      
        
                                        this.storageContract.methods.getDetails(data[2]).call(
                                            {from:accounts[0]}, function(error, y){
                                                // alert('called')
                                                if(!error) {
                                                  obj['ipfsHash'] = y[0]
                                                  obj['name'] = y[1]
                                                  obj['type'] = y[2]
                                                  let f = Number(y[3])
                                                  obj['date'] = new Date(f*1000).toLocaleDateString()
                                                  obj['hospital'] = y[4]
                                                
                                                  
                                                  //push the record object into array of objects                        
                                                  myarray.push(obj)
                                                  
                                                  // alert("Objec"+myarray[0].name + myarray[0].type)
                                                  
                                                  this.setState({
                                                  arr: myarray
                                                  })  
  
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
              // console.log(error)
            }
     
          })
    }

   render() {
     //don't render if there are no records for the user
     localStorage.setItem("hosp", "false");

      
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
                <h2>My Records List
                </h2>
                
              </CardHeader>
             
              <CardBody>
              <Form
                    onSubmit={this.getRecords}
                    
                    className="form-horizontal"
                >
                    <FormGroup row>
                        <Col md="2" style={{ marginTop: "0.5%", textAlign: "right" }}>
                          <Label><b>Enter Patient Aadhaar Number: </b></Label>
                        </Col>
                        <Col xs="12" md="3">
                            <Input
                                style={{border:'1px solid red',backgroundColor:'#f0f3f5'}}
                                type="text"
                                pattern=".{10,10}"
                                min="0000000001"
                                onChange={event => this.setState({ aadhaar: event.target.value })}          
                                required={true}      
                            />
                        </Col>
                        <Col xs="3" sm="3" md="2">
                      
                      
                      <Button id="getRecords"
                      className="btn-facebook mb-1" block
                      block color="primary" 
                      size="sm"
                      
                      type="submit"
                        ><b><span>Get Records</span></b></Button>
                    </Col>
                    </FormGroup>
                </Form>
              <FormGroup row >
                        <Col md="2" style={{ marginTop: "0.5%", textAlign: "right" }}>
                          <Label id="seedLabel" style={{display:'none'}}><b>Enter seedphrase: </b></Label>
                        </Col>
                        <Col xs="12" md="3">
                            <Input
                                id="seedPhrase"
                                style={{border:'1px solid red',backgroundColor:'#f0f3f5', display:'none'}}
                                type="password"
                                onChange={event => this.setState({ seedphrase: event.target.value })}          
                                   
                            />
                        </Col>
                </FormGroup>        
                <Table responsive striped>
                  <thead>
                  <tr>
                    <th>Record ID</th>
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
  

  export default ViewSharedRecords;