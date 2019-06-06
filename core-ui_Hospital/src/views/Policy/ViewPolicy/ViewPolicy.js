import React, { Component } from "react";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import ipfs from '../../../Dependencies/ipfs'
import {decrypt} from '../../../Dependencies/crypto'
import { getKeys,keyDecrypt } from '../../../Dependencies/pgp';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Card, CardBody, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter, Table } from "reactstrap";
import {userdetails, organization, policy, storage} from "../../../contract_abi";
import ViewSharedRecords from "./ViewSharedRecords";


export class ViewPolicy extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        userAddress : '',
        selectValue: '',
        account: null,
        value:'',
        web3:null,
        policyAddress: 'NA',
        premium: 'NA',
        stateMap:{0:'AppliedWOR', 1:'Applied', 2:'AppliedSP', 3:'Active', 4:'Grace', 5:'Lapsed', 6:'RenewalWOR', 7:'Renewal',8: 'RenewalSP', 9:'Inactive', 10:'Defunct', 11:'NA'},
        policyDetails:['NA', 'NA', 'NA', 10, 'NA', 'NA', 'NA', 'NA', 'NA', 'NA'],
        view: 0,
        hash: "",
        masterKey: "",
        seedphrase:null,
        primary: false,
      };
  
      this.getDate = this.getDate.bind(this)
      this.setPremium = this.setPremium.bind(this)
      this.changeToGrace = this.changeToGraceLapse.bind(this)
      this.settleClaim = this.settleClaim.bind(this)
      this.viewRecord = this.viewRecord.bind(this)
      this.togglePrimary = this.togglePrimary.bind(this)
      }

 //function for toggling the modal
 togglePrimary() {
  this.setState({
    primary: !this.state.primary,
  });
}
      async componentWillMount() {

        const {data} = this.props.location

        if(data!=null) {
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

    
      }


     async instantiateContract() {
  
      //User Details Contract Instantiation
      
      const contractAddress_u = userdetails.contract_address       
      const ABI_u = userdetails.abi              
      var UserContract = new this.state.web3.eth.Contract(ABI_u, contractAddress_u)     
      this.UserContract = UserContract
      
      //Organization Contract Instantitation
      const orgContractAddress = organization.contract_address
      const orgABI = organization.abi
      var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
      this.orgContract = orgContract

      const contractAddress = storage.contract_address
            const ABI = storage.abi    
            var storageContract = new this.state.web3.eth.Contract(ABI, contractAddress)      
            this.storageContract = storageContract

      const {data} = this.props.location
      //Get account from metamask
      const policyContractAddress = data       
      const policyABI = policy.abi              
      var policyContract = new this.state.web3.eth.Contract(policyABI, policyContractAddress)     
      this.policyContract = policyContract
      await this.viewPolicy()
          
              
      }
  
    viewPolicy() {
      document.getElementById("premiumButton").style.display = "none"
     this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
                        
            //Policy Contract Instantiation
            
           
            if(this.policyContract) {
              this.policyContract.methods.getPremium().call(
                { from: accounts[0] },
                (error, prem) => {
                  if(prem!=0) {
                    this.setState({
                      premium: prem
                    })  
                  }
                  if(error)
                    console.log("Error in premium:", error)
                  console.log("Premium:",prem)
                  console.log("in")
                  this.policyContract.methods.getDetails()
                  .call(
                    {from: accounts[0]},
                    (error, details) => {
                      
                      this.setState({
                        policyDetails: details
                      })
                      
                      console.log("Details:",details)
                          this.policyContract.methods.getClaimDetails().call(
            { from: accounts[0] },
            (error, claimDetails) => {
              console.log("Claim Details:",claimDetails)
              this.setState({
                claimRecordID: claimDetails[2]

              })

              this.storageContract.methods.viewRecord(claimDetails[2]).call(
                {from:accounts[0]}, (error, y)=>{
                    // alert('called')
                    if(!error) { 
                      console.log("record:",y)                     
                     this.setState({
                      hash: y[0],
                      masterKey: y[5] 
                      })  

                    }
                })
            }
          )

                    }
                  )
               
                }
              )

            }
            

      });
  
    }

    viewRecord(ipfs_hash,masterkey) {
     
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


    getDate(number) {
      let f = Number(number)
      f = new Date(f*1000).toLocaleDateString()
      if(f==='01/01/1970')
        f = "NA"
      return f                 
    }

    checkButton(state) {
      console.log(state)
      if(state!=10) {
        if(state==1) {
           
            var btn = document.getElementById("whichButton");
            btn.innerHTML = "Set Premium";
            btn.addEventListener("click",() =>{
              document.getElementById("premiumButton").style.display = "block"
              
              document.getElementById("whichButton").style.display = "none";
            return
        }
            )
      }
      else if(state==7) {
           
        var btn = document.getElementById("whichButton");
        btn.innerHTML = "Set Premium for Renewal";
        btn.addEventListener("click",() =>{
          document.getElementById("premiumButton").style.display = "block"
          
          document.getElementById("whichButton").style.display = "none";
        return
    }
        )
  }
        else {
        var btn = document.getElementById("whichButton");
          btn.style.display = "none";
      }
      }
      
    }
     settleClaim() {


       this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
        
        this.policyContract.methods.getClaimDetails().call(
          { from: accounts[0] },
          (error, claimDetails) => {
            console.log(claimDetails[0])
            this.policyContract.methods.acceptClaim()
                          .send(
                            {
                              from: accounts[0],
                              gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei')),
                              value:this.state.web3.utils.toHex(this.state.web3.utils.toWei(claimDetails[0],'wei')) 
                            }).then(async (err, txHash)=> {
                              alert(txHash)
                              window.location.reload(true);
                            })
          }
        )

        
      });

    
    }

    checkClaim(claimStatus) {
//      alert(claimStatus)
      if(claimStatus == 0 ) {
        document.getElementById("claimButton").style.display = "none"
        document.getElementById("viewClaimRecord").style.display = "none"
      }
      // else if(claimStatus == 1){
      //   let amountToPay

      //   this.state.web3.eth.getAccounts((error, accounts) => {
      //     //get the account from metamask
          
      //     this.policyContract.methods.getClaimDetails().call(
      //       { from: accounts[0] },
      //       (error, claimDetails) => {
      //         console.log(claimDetails[0])
      //         this.setState({
      //           claimRecordID: claimDetails[2]

      //         })
      //         this.storageContract.methods.getDetails(claimDetails[2]).call(
      //           {from:accounts[0]}, function(error, y){
      //               // alert('called')
      //               if(!error) {                      
      //                this.setState({
      //                 hash: y[0],
      //                 masterKey: y[5] 
      //                 })  

      //               }
      //           })
      //       }
      //     )
  
          
      //   });
      // }
    }

    setPremium(event) {
      event.preventDefault()
      this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
                        
            //Policy Contract Instantiation
            
           
            if(this.state.premium>0)
              this.policyContract.methods.setPremium(this.state.premium).send(
                { from: accounts[0],
                  gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))
                },
                (err, txHash) => {
                  if(!err) {
                    console.log(txHash)
                    window.location.reload(true)
                  }
                }
              )
            

      });

    }

    
    changeToGraceLapse(state) {  //change the policy status to grace
      console.log(state)
      this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
                        
            //Policy Contract Instantiation
        
            if(state == 3) {
              alert("inside")
              this.policyContract.methods.policyGrace().send(
                { from: accounts[0],
                  gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))
                },
                (err, txHash) => {
                  if(!err) {
                    console.log(txHash)
                    alert("Set to Grace")
                  }
                }
              )
            }
            else if(state == 4) {
              this.policyContract.methods.policyLapse().send(
                { from: accounts[0],
                  gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))
                },
                (err, txHash) => {
                  if(!err) {
                    console.log(txHash)
                    alert("Set to Grace")
                  }
                }
              )
            }
      });
    }

   render() {
    const {data} = this.props.location
    const weiToEther = 1000000000000000000
    console.log(data)
    if(data==null) {
      return(
        <div>Go back to accept policy page and try again!</div>
      );
    }
    
   
    else if (data!=null){
      if(this.state.view == 1) {
        return(
          <ViewSharedRecords/>
        )
      }
      else {
        return (
          <div className="animated fadeIn">
               <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                    className={'modal-primary '} size="xl">
                  <ModalHeader toggle={this.togglePrimary}>Record</ModalHeader>
                    <ModalBody id="itemPreview">
                    </ModalBody>
                </Modal> 
               <Row>
              <Col md="9" lg="12" xl="12">
            <Card>
           
              <CardHeader>
                <strong>My Policy Details</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row>
              <Col md="2" style={{ marginTop: "0.5%", textAlign: "right" }}>
                            <Label id="seedLabel"><b>Enter seedphrase: </b></Label>
                          </Col>
                          <Col xs="12" md="3">
                              <Input
                                  id="seedPhrase"
                                  style={{border:'1px solid red',backgroundColor:'#f0f3f5'}}
                                  type="password"
                                  onChange={event => this.setState({ seedphrase: event.target.value })}          
                                     
                              />
                          </Col>
                          </FormGroup>
              <Table responsive striped>
              <tbody>
                <tr>
                  <td><strong>Policy Number</strong></td>
                  <td>{data}</td>
                </tr>
                <tr>
                  <td><strong>Insurance Company Address</strong></td>
                  <td>{this.state.policyDetails[0]}</td>
                </tr>
                <tr>
                  <td><strong>Premium</strong></td>
                  <td>{this.state.premium/weiToEther} ether</td>
                </tr>
                <tr>
                  <td><strong>State</strong></td>
                  <td>{this.state.stateMap[this.state.policyDetails[3]]}</td>
                </tr>
                <tr>
                  <td><strong>Applied Date</strong></td>
                  <td>{this.getDate(this.state.policyDetails[5])}</td>
                </tr>
                <tr>
                  <td><strong>Start Date</strong></td>
                  <td>{this.getDate(this.state.policyDetails[6])}</td>
                </tr>
                <tr>
                  <td><strong>End Date</strong></td>
                  <td>{this.getDate(this.state.policyDetails[7])}</td>
                </tr>
                <tr>
                  <td><strong>Lapse Date</strong></td>
                  <td>{this.getDate(this.state.policyDetails[8])}</td>
                </tr>
                <tr>
                  <td><strong>Message</strong></td>
                  <td style={{color:'red'}}>{this.state.policyDetails[9]}</td>
                </tr>
                <tr>
                  <td><strong>View Records</strong></td>
                  <td><Button onClick={()=>{
  
                    sessionStorage.setItem('policyAddress',data)
                    this.setState({view:1})
                  }}>Click Here</Button></td>
                </tr>
                <tr>
                  <td>
                    {this.checkButton(this.state.policyDetails[3])}
                    <Button id="whichButton"
                                className="btn-facebook mb-1" block
                                block color="primary" 
                                size="sm"
                                  ><b><span></span></b></Button>
                      {this.checkClaim(this.state.policyDetails[12])}
                    <Button id="claimButton"
                                className="btn-facebook mb-1" block
                                block color="red"
                                style={{backgroundColor:"red"}} 
                                size="sm"
                                onClick={()=>{
                                  this.settleClaim()
                                }
                              }
                                  ><b><span>Settle Claim</span></b></Button>
                                  <Button id="viewClaimRecord"
                                className="btn-facebook mb-1" block
                                block color="red"
                                style={{backgroundColor:"red"}} 
                                size="sm"
                                onClick={()=>{
                                  this.viewRecord(this.state.hash, this.state.masterKey)
                                }
                              }
                                  ><b><span>View Claim Record</span></b></Button>
                  </td>
                 
                </tr>
                <tr>
                <td>
                    <Button id="graceButton"
                                className="btn-facebook mb-1" block
                                block color="primary" 
                                size="sm"
                                onClick={()=>{
                                  this.changeToGraceLapse(this.state.policyDetails[3])
                                }
                              }
                                  ><b><span>Grace</span></b></Button>
                  </td>
                </tr>
                <tr>
                <td>
                    <Button id="graceButton"
                                className="btn-facebook mb-1" block
                                block color="primary" 
                                size="sm"
                                onClick={()=>{
                                  this.changeToGraceLapse(this.state.policyDetails[3])
                                }
                              }
                                  ><b><span>Lapse</span></b></Button>
                  </td>
                </tr>
                <tr>
                <td>
                <Form
                      onSubmit={this.setPremium}   
                      className="form-horizontal"
                      id="premiumButton"
                  >
               
                            <Label><b>Enter premium(in ether): </b></Label>
                         
                          
                              <Input
                                  style={{border:'1px solid red',backgroundColor:'#f0f3f5'}}
                                  type="text"
                                  onChange={event => this.setState({ premium: event.target.value })}          
                                  required={true}      
                              />
                    
                        
                          <Button 
                                className="btn-facebook mb-1" block
                                block color="primary" 
                                size="sm"
                                type="submit"
                                  ><b><span>Set</span></b></Button>
                                    </Form> 
                      </td>
                     
                                 
                    
                
                </tr>
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
      
     

     
    
  }
  

  export default ViewPolicy;