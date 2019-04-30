import React, { Component } from 'react'
import ipfs from '../../../Dependencies/ipfs'
import {decrypt} from '../../../Dependencies/crypto'
import { getKeys,keyDecrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, organization, policy} from "../../../contract_abi";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Input,
  FormText,
  Label,
  FormGroup,
  Form,
  CardFooter,
  Table
} from "reactstrap";


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
        stateMap:{0:'Applied', 1:'Active', 2:'Grace', 3:'Lapsed', 4:'Renewal', 5:'Inactive', 6:'Defunct'},
        policyDetails:['NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA']
      };
  
 
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
                                    policyDetails: details
                                  })
                                }
                              )
                            }
                          )
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


   render() {
    
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
              <td>{this.state.premium}</td>
            </tr>
            <tr>
              <td><strong>State</strong></td>
              <td>{this.state.stateMap[this.state.policyDetails[3]]}</td>
            </tr>
            <tr>
              <td><strong>Start Date</strong></td>
              <td>{this.state.policyDetails[5]}</td>
            </tr>
            <tr>
              <td><strong>End Date</strong></td>
              <td>{this.state.policyDetails[6]}</td>
            </tr>
            <tr>
              <td><strong>Lapse Date</strong></td>
              <td>{this.state.policyDetails[7]}</td>
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