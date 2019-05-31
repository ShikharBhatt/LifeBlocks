import React, { Component } from 'react'
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, organization, policy} from "../../../contract_abi";
import SharePolicy from "../ApplyPolicy/SharePolicy"
import ShareRecordsRenewal from "./ShareRecordsRenewal"
import {Button,Card,CardBody,CardHeader,Col,Row,Table} from "reactstrap";
//import task_def from './task_def';

export class ViewPolicy extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        orgAddress : '',
        contractAddress : '',
        userAddress : '',
        selectValue: '',
        account: null,
        value:'',
        web3:null,
        policyAddress: 'NA',
        premium: 'NA',
        share:0,
        penalty:0,
        stateMap:{0:'AppliedWOR', 1:'Applied', 2:'AppliedSP', 3:'Active', 4:'Grace', 5:'Lapsed', 6:'RenewalWOR', 7:'Renewal',8: 'RenewalSP', 9:'Inactive', 10:'Defunct', 11:'NA'},
        policyDetails:['NA', 'NA', 'NA', 10, 'NA', 'NA', 'NA', 'NA', 'NA', 'NA']
      };
  
      this.getDate = this.getDate.bind(this);
      this.checkButton = this.checkButton.bind(this);
      this.giveRecords = this.giveRecords.bind(this);
      this.payPremium = this.payPremium.bind(this);
      this.payPremiumGrace = this.payPremiumGrace.bind(this);
      this.payPremiumLapse = this.payPremiumLapse.bind(this);
      this.renewPolicy = this.renewPolicy.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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

      handleSubmit = async e => {
        e.preventDefault();
        await this.setState({
          orgAddress: this.state.policyDetails[0],
          contractAddress: this.state.policyAddress
        })
        const response = await fetch('/api/insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orgAddress: this.state.orgAddress, contractAddress: this.state.contractAddress }),
        });
        const body = await response.text();
        this.setState({ responseToPost: body });
        console.log("Response from API : ", this.state.responseToPost)
      };


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

      //Get account from metamask
          await this.state.web3.eth.getAccounts((error,accounts) => {
          if(!error) {
            console.log(accounts[0])
            this.setState({
              account: accounts[0]
            })
            this.viewPolicy()
          }
          else {
            console.log(error)
          }
   
        })              
      }
  
     viewPolicy() {
      document.getElementById("policy").style.display = "none"
      this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
        this.UserContract.methods.login(sessionStorage.getItem('aadhaar')).call(
          { from: accounts[0] },
          (error, x)=> {
            //check if account exists
            if (error) {
              alert("Wrong");
              return;
            }
            if (x === true) {
              //alert("Aadhaar available");
              //get address from aadhaar number
              this.UserContract.methods
                .getAddress(sessionStorage.getItem('aadhaar'))
                .call(
                  { from: accounts[0] },
                  (error, add) => {
                    //get account address from SC
                    if (error) {
                      alert("Wrong Details");
                      return;
                    }

                    //if account is valid
                    if (add === accounts[0]) {
                      this.UserContract.methods
                      .getPolicyMap(sessionStorage.getItem('aadhaar'))
                      .call(
                        {from : accounts[0]},
                        (error, policyAdd) => {
                          if(policyAdd!="0x0000000000000000000000000000000000000000") {
                  
                            document.getElementById("policy").style.display = "inline-block"
                            document.getElementById("policy").innerText = "Policy Found"
                            document.getElementById("policy").style.color = "green"


                            this.setState({
                              policyAddress: policyAdd
                            })
                        
                        //Policy Contract Instantiation
                        const policyContractAddress = this.state.policyAddress       
                        const policyABI = policy.abi              
                        var policyContract = new this.state.web3.eth.Contract(policyABI, policyContractAddress)     
                        this.policyContract = policyContract
                        
                        //to check if contract is instantiated
                        if(this.policyContract) {
                          this.policyContract.methods.getPremium()
                          .call(
                            {from: accounts[0]},
                            (error, prem) => {
                              console.log(prem)
                              if(prem!=0) {
                                this.setState({
                                  premium: prem
                                })  
                              }
                              this.policyContract.methods.getDetails()
                              .call(
                                {from: accounts[0]},
                                (error, details) => {
                                  
                                  this.setState({
                                    policyDetails: details,
                                    penalty: details[11]
                                  })
                                }
                              )

                              
                            }
                          )

                          // this.policyContract.methods.getPenalty()
                          //     .call(
                          //       {from: accounts[0]},
                          //       (error, pen) => {
                          //         console.log(pen)
                          //         this.setState({
                          //           penalty: pen
                          //         })
                          //       }
                          //     )
                        }

                          }
                          else {
                            document.getElementById("policy").style.display = "inline-block"
                            document.getElementById("policy").innerText = "No Policy Found"
                            document.getElementById("policy").style.color = "red"
                          }
                        }
                      )
                    } else {
                      alert("Details Incorrect");
                    }
                  }
                );
            } else {
              alert("Details Incorrect");
            }
          }
        );
      });
  
     }

     getDate(number) {
      let f = Number(number)
      f = new Date(f*1000).toLocaleDateString()
      if(f==='01/01/1970')
        f = "NA"
      return f                 
    }

    giveRecords() {
      alert("goodbye")
    }

    payPremium() {
      alert(this.state.premium)
      this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
        this.UserContract.methods.login(sessionStorage.getItem('aadhaar')).call(
          { from: accounts[0] },
          (error, x)=> {
            //check if account exists
            if (error) {
              alert("Wrong");
              return;
            }
            if (x === true) {
              //alert("Aadhaar available");
              //get address from aadhaar number
              this.UserContract.methods
                .getAddress(sessionStorage.getItem('aadhaar'))
                .call(
                  { from: accounts[0] },
                  (error, add) => {
                    //get account address from SC
                    if (error) {
                      alert("Wrong Details");
                      return;
                    }

                    //if account is valid
                    if (add === accounts[0]) {
                      this.policyContract.methods.confirmPolicy()
                          .send(
                            {
                              from: accounts[0],
                              gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei')),
                              value:this.state.web3.utils.toHex(this.state.web3.utils.toWei(this.state.premium,'wei')) 
                            }).then(async (err, txHash)=> {
                              alert(txHash)
                             
                               
                                await this.setState({
                                  orgAddress: this.state.policyDetails[0],
                                  contractAddress: this.state.policyAddress 
                                })
                                const response = await fetch('/api/insert', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ orgAddress: this.state.orgAddress, contractAddress: this.state.contractAddress }),
                                });
                                const body = await response.text();
                                this.setState({ responseToPost: body });
                                console.log("Response from API : ", this.state.responseToPost)
                                
                              
                              // let task = new task_def();
                              // let insertTask = task.insert(this.state.policyDetails[0],this.state.policyAddress);
                              // console.log("Inserted Task : ", insertTask);  
                            })
                    } else {
                      alert("Details Incorrect");
                    }
                  }
                );
            }//end x is true condition 
            else {
              alert("Details Incorrect");
            }
          }
        );
      });

    }

    payPremiumGrace() {
      alert(this.state.premium)
      this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
        this.UserContract.methods.login(sessionStorage.getItem('aadhaar')).call(
          { from: accounts[0] },
          (error, x)=> {
            //check if account exists
            if (error) {
              alert("Wrong");
              return;
            }
            if (x === true) {
              //alert("Aadhaar available");
              //get address from aadhaar number
              this.UserContract.methods
                .getAddress(sessionStorage.getItem('aadhaar'))
                .call(
                  { from: accounts[0] },
                  (error, add) => {
                    //get account address from SC
                    if (error) {
                      alert("Wrong Details");
                      return;
                    }

                    //if account is valid
                    if (add === accounts[0]) {
                      this.policyContract.methods.extendPolicy()
                          .send(
                            {
                              from: accounts[0],
                              gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei')),
                              value:this.state.web3.utils.toHex(this.state.web3.utils.toWei(this.state.premium,'wei')) 
                            }).then(async (err, txHash)=> {
                              alert(txHash)
                             
                               
                                await this.setState({
                                  orgAddress: this.state.policyDetails[0],
                                  contractAddress: this.state.policyAddress 
                                })
                                const response = await fetch('/api/insert', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ orgAddress: this.state.orgAddress, contractAddress: this.state.contractAddress }),
                                });
                                const body = await response.text();
                                this.setState({ responseToPost: body });
                                console.log("Response from API : ", this.state.responseToPost)
                                
                              
                              // let task = new task_def();
                              // let insertTask = task.insert(this.state.policyDetails[0],this.state.policyAddress);
                              // console.log("Inserted Task : ", insertTask);  
                            })
                    } else {
                      alert("Details Incorrect");
                    }
                  }
                );
            }//end x is true condition 
            else {
              alert("Details Incorrect");
            }
          }
        );
      });

    }

    payPremiumLapse() {
      alert(this.state.premium)
      var totalPayment = (Number(this.state.premium) + Number(this.state.penalty)).toString()
      //totalPayment = totalPayment.toString()

      this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
        this.UserContract.methods.login(sessionStorage.getItem('aadhaar')).call(
          { from: accounts[0] },
          (error, x)=> {
            //check if account exists
            if (error) {
              alert("Wrong");
              return;
            }
            if (x === true) {
              //alert("Aadhaar available");
              //get address from aadhaar number
              this.UserContract.methods
                .getAddress(sessionStorage.getItem('aadhaar'))
                .call(
                  { from: accounts[0] },
                  (error, add) => {
                    //get account address from SC
                    if (error) {
                      alert("Wrong Details");
                      return;
                    }

                    //if account is valid
                    if (add === accounts[0]) {
                      this.policyContract.methods.confirmRenewal()
                          .send(
                            {
                              from: accounts[0],
                              gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei')),
                              value:this.state.web3.utils.toHex(this.state.web3.utils.toWei(totalPayment,'wei')) 
                            }).then(async (err, txHash)=> {
                              alert(txHash)
                             
                               
                                await this.setState({
                                  orgAddress: this.state.policyDetails[0],
                                  contractAddress: this.state.policyAddress 
                                })
                                const response = await fetch('/api/insert', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ orgAddress: this.state.orgAddress, contractAddress: this.state.contractAddress }),
                                });
                                const body = await response.text();
                                this.setState({ responseToPost: body });
                                console.log("Response from API : ", this.state.responseToPost)
                                
                              
                              // let task = new task_def();
                              // let insertTask = task.insert(this.state.policyDetails[0],this.state.policyAddress);
                              // console.log("Inserted Task : ", insertTask);  
                            })
                    } else {
                      alert("Details Incorrect");
                    }
                  }
                );
            }//end x is true condition 
            else {
              alert("Details Incorrect");
            }
          }
        );
      });

    }

    renewPolicy() {
      this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
              this.policyContract.methods.renewPolicy().send(
                { from: accounts[0],
                  gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))
                },
                (err, txHash) => {
                  if(!err) {
                    console.log(txHash)
                    
                    this.setState({
                      share:2
                    })
                    
                  }
                }
              )
            

      });
    }

    checkButton(state) {
      console.log(state)
      if(state!=10) {
        if(state == 0) {
          sessionStorage.setItem('addressPolicy', this.state.policyAddress)
          sessionStorage.setItem('addressCompany', this.state.policyDetails[0])
          var btn = document.getElementById("whichButton");
          btn.innerHTML = "Submit Records";
          btn.addEventListener("click", ()=>{this.setState({share:1})});
          return
        }
        else if(state==1) {
          if(this.state.premium === "NA")
          {
            document.getElementById("whichButton").style.display = 'none';            
          }
        }
          else if(state == 2) {
            var btn = document.getElementById("whichButton");
            btn.innerHTML = "Pay Premium";
            btn.addEventListener("click", ()=>{this.payPremium()});
            return
  
          }

          else if(state == 3 ){
            document.getElementById("whichButton").style.display = "none";
          }

          else if(state == 4) {
            var btn = document.getElementById("whichButton");
            btn.innerHTML = "Pay Premium to renew policy";
            btn.addEventListener("click", ()=>{this.payPremiumGrace()});
            return

          }
          else if(state == 5) {
            sessionStorage.setItem('addressPolicy', this.state.policyAddress)
            sessionStorage.setItem('addressCompany', this.state.policyDetails[0])
            var btn = document.getElementById("whichButton");
            btn.innerHTML = "Renew";
            btn.addEventListener("click", ()=>{this.renewPolicy()});
            return
          }
          else if(state == 6) {
            sessionStorage.setItem('addressPolicy', this.state.policyAddress)
            sessionStorage.setItem('addressCompany', this.state.policyDetails[0])
            var btn = document.getElementById("whichButton");
            btn.innerHTML = "Submit Records for Renewal";
            btn.addEventListener("click", ()=>{this.setState({share:2})});
            return
          }
          else if(state == 8) {
            var btn = document.getElementById("whichButton");
            btn.innerHTML = "Pay Premium to renew policy";
            btn.addEventListener("click", ()=>{this.payPremiumLapse()});
            return
          }
        
      }
      // else {
      //   var btn = document.getElementById("whichButton");
      //     btn.style.display = "none";
      // }
    }

   render() {
    const weiToEther = 1000000000000000000
    if(this.state.share == 1) {
      return (      
        <div>
          <SharePolicy />
        </div>
      )
    }
    else if(this.state.share == 2) {
      return (      
        <div>
          <ShareRecordsRenewal />
        </div>
      )
    }
    else 
      return (
      <div className="animated fadeIn">
           
           <Row>
          <Col md="9" lg="12" xl="12">
        <Card>
       
          <CardHeader>
            <strong>My Policy Details: <b id="policy" > </b></strong>
          </CardHeader>
          <CardBody>
          <Table responsive striped>
          <tbody>
            <tr>
              <td><strong>Policy Number</strong></td>
              <td>{this.state.policyAddress}</td>
            </tr>
            <tr>
              <td><strong>Insurance Company Address</strong></td>
              <td>{this.state.policyDetails[0]}</td>
            </tr>
            <tr>
                <td><strong>Premium</strong></td>
                <td>{this.state.premium/weiToEther} ether </td>
              </tr>
              <tr>
                <td><strong>Penalty</strong></td>
                <td>{this.state.penalty/weiToEther} ether </td>
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
                <td>
                  {this.checkButton(this.state.policyDetails[3])}
                  <Button id="whichButton"
                              className="btn-facebook mb-1" block
                              block color="primary" 
                              size="sm"
                                ><b><span></span></b></Button>
                </td>
                {/* <Button onClick={this.handleSubmit}>Submit</Button> */}
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
  

  export default ViewPolicy;