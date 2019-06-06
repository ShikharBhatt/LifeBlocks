
import React, { Component } from 'react'
import ipfs from '../../../Dependencies/ipfs'
import { getKeys,keyDecrypt, keyEncrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, storage, organization, permissions} from "../../../contract_abi";
import { FormGroup, Input, Form, Card, CardBody, CardHeader, CardFooter, Col, Row, Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


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
        insuranceAdds:[],
        insuranceCompanies: [],
        insuranceAddress: null,
        seedphrase:null,
        selectedRecords: [],
      };
  
      
        this.onSubmit = this.onSubmit.bind(this);
        this.Change = this.Change.bind(this);
        this.displayRecords = this.displayRecords.bind(this);
        this.togglePrimary = this.togglePrimary.bind(this);
        this.insurancePopulate = this.insurancePopulate.bind(this);
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

      const permissionsContractAddress = permissions.contract_address
      const permissionsABI = permissions.abi
      var permissionsContract = new this.state.web3.eth.Contract(permissionsABI, permissionsContractAddress)
      this.permissionsContract = permissionsContract


      //Get account from metamask
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
                    this.storageContract.methods.viewRecord(x[i]).call(
                      {from:address}, function(error, y){
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
                      }.bind(this))
      
                  }
                
                }
                else {
                  alert("No records found")
                }

              
            }.bind(this))

        })  

        await this.state.web3.eth.getAccounts((error,accounts) => {
          if(!error) {
            console.log(accounts[0])
            this.setState({
              account: accounts[0]
            })
            this.orgContract.methods.retAddresses().call({
              from: accounts[0]}, (error, x) => {
                console.log(x)
                this.setState({
                  insuranceAdds: x
                })

                let insurance = []
                
                for(let i=0; i<x.length; i++) {
                  this.orgContract.methods.getOrgName(x[i]).call(
                    {from: accounts[0]}, (error, y) => {
                      let obj = {}
                      obj['address'] = x[i]
                      obj['name'] = y

                      insurance.push(obj)

                      this.setState({
                        insuranceCompanies: insurance
                      })

                      console.log(this.state.insuranceCompanies)
                    }
                  )
                }
              }
            )
          }
          else {
            console.log(error)
          }
   
        })              

                    
      }


      insurancePopulate(insuranceAdds) {
        console.log(insuranceAdds)
        if(insuranceAdds.length===this.state.insuranceCompanies.length) {
          const rows =  insuranceAdds.map((row, index) => {
            return (
                <option key={index} value={row}>
                  {this.state.insuranceCompanies[index].name}
                </option>
                );
        
        });
        
        //return the table of records
        return rows

        }
      }

      //function for modal
      togglePrimary() {
        this.setState({
          primary: !this.state.primary,
        });
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
          let keyObj, un_mkey, keyObjOrg,seedphrase, selectedRecords
          let recordData = []
          
          let  m_key = []
          let myaadhaar = sessionStorage.getItem('aadhaar')
          let permissionsContract = this.permissionsContract
          let UserContract = this.UserContract
          let organizationAddress = this.state.insuranceAddress
          console.log("Organization:", organizationAddress)
          let account 
          let gp = this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))
          let gasL = this.state.web3.utils.toHex(4700000)
          recordData = this.state.arr
          seedphrase = this.state.seedphrase
          selectedRecords = this.state.selectedRecords

          await this.state.web3.eth.getAccounts((error, accounts) => {
            //transaction to link aadhaar card to address
            account = accounts[0]
            this.orgContract.methods
              .getKeyHash(this.state.insuranceAddress)
              .call({
                from: accounts[0],
                gasPrice: this.state.web3.utils.toHex(
                  this.state.web3.utils.toWei("0", "gwei")
                )
              })
              .then(pgpIpfsHashOrg => {
                getKeys(pgpIpfsHashOrg, function (key) {
                  //in callback function of getKeys
                  keyObjOrg = JSON.parse(key);
                  //console.log(this.state.aadhaar)
                  console.log("key object Organization: " + keyObjOrg);
                  console.log("key object type: " + typeof keyObjOrg);
                  console.log("public key : " + keyObjOrg.publicKeyArmored);
                  console.log(Object.getOwnPropertyNames(keyObjOrg));
                  UserContract.methods.getKeyHash(myaadhaar).call(
                    {from:account,gasPrice:gp}).then((pgpIpfsHash) => {
                        //get pgp key from ipfs
                         
                          getKeys(pgpIpfsHash, async function(key){
                            keyObj = JSON.parse(key)
                            console.log("key object: " +keyObj)
                            console.log("key obj properties: "+Object.getOwnPropertyNames(keyObj))
                            //call to function to decrypt masterkey using pgp private key
                            for(let i=0;i<selectedRecords.length;i++) {
                              let data = recordData[selectedRecords[i]].recordId
                              console.log("Record id(-):",data)
                              await keyDecrypt(keyObj,recordData[selectedRecords[i]].masterkey,seedphrase, async function(plain){
                                un_mkey = (plain)
                                console.log("unencrypted masterkey : "+un_mkey)
                                await  keyEncrypt(un_mkey, keyObjOrg, async function (cipher) {
                                  //in callback function of keyEncrypt

                                  console.log("encrypted masterkey: " + cipher);
                                  console.log(account)
                                  console.log("Record id(----):",data) 


                                  permissionsContract.methods
                                  .grant(data, organizationAddress,cipher, account )
                                  .send(
                                    {
                                      from: account,
                                      gasPrice: gp,
                                      gas:gasL
                                    },
                                    function(error, txHash) {
                                      if (!error) {
                                        console.log("tx: " + txHash);

                                        // permissionsContract.events.permissionGranted({fromBlock: 'latest'},
                                        //   (error, event) => {
                                        //     if(!error)
                                        //       console.log(event)
                                        //   }
                                        // ).on('data', (event) => {
                                        //     console.log(event); // same results as the optional callback above
                                        //   })
                                        // eventListener.watch(function(err, result){
                                        //   if(!err) {
                                        //     console.log("PermissionList id:",result.args.id)
                                        //   }
                                        //   else
                                        //   {console.log(err)}
                                        //})
                                      } else console.log(error);
                                    }
                                  );
                                })
                                               
                            })
                            }
                        })//end get keys
                        
                        
                    })
                });
              });
      
        
          });

          

        }

      }
  
    onSubmit(){
       // event.preventDefault();

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
        <Form
                    onSubmit={this.shareRecords}
                    method="post"
                    encType="multipart/form-data"
                    className="form-horizontal"
                  >
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
                    {this.displayRecords(this.state.arr)}
                  </tbody>
                </Table>
              
                  
                    <FormGroup row>
                
                      <Col xs="12" md="6">
                        <Input 
                          style={{border:'1px solid black'}}
                          type="select" required={true} defaultValue="no-value" onChange={event => {
                          this.setState({ insuranceAddress:event.target.value })
                          }}
                          defaultValue=""
                          required={true}
                          >
                          <option value="" disabled>Select Organization</option>
                          {this.insurancePopulate(this.state.insuranceAdds)}
                        </Input>
                        
                      </Col>
              </FormGroup>

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
  

  export default ShareRecords;