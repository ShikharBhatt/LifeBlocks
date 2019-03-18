import React, { Component } from 'react'
import ipfs from '../../../Dependencies/ipfs'
import {decrypt} from '../../../Dependencies/crypto'
import { getKeys,keyDecrypt } from '../../../Dependencies/pgp';
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {userdetails, organization, policyTemplate} from "../../../contract_abi";
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


export class ApplyPolicy extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        userAddress : '',
        selectValue: '',
        account: null,
        value:'',
        web3:null,
        coverage:null,
        insuranceAdds:[],
        insuranceCompanies: [],
        insurancePolicies: [],
        insuranceAddress:null,
        insuranceName:null,
        appliedAddress: ''
      };
  
      this.insurancePopulate = this.insurancePopulate.bind(this)
      this.showPolicies = this.showPolicies.bind(this);
 
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
            this.orgContract.methods.retrieveType("Insurance").call({
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
  
      //populate the insurance companies drop down menu
      insurancePopulate(insuranceAdds) {

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


     //show policies based on the insurance company selected 
      showPolicies(insAdd) {
        if(insAdd) {
          this.orgContract.methods.returnAllPolicy(insAdd).call(
            {from: this.state.account}, (error, policies) => {
              if(!error) {
                
                this.setState({
                  insurancePolicies: policies
                })
              }
            })
    
            const rows = this.state.insurancePolicies.map((row, index) => {
              return (
                  <tr key={index}>
                 
                      <td>{row}</td>
                      {/* <td>{row.job}</td> */}
                      <td>
                        <Input
                          type="text"
                          placeholder="Enter Coverage"
                          onChange={event =>
                            this.setState({ coverage: event.target.value })
                          }
                          required={true}
                        />
                    </td>
                      <td></td>
                      <td></td>
                      <td>
                        <Button
                        
                        block color="primary" 
                        size="lg"
                        value={row} 
                        onClick={
                                  () => 
                                      {
                                        this.setState({appliedAddress:row}, ()=> {
                                          this.applyPolicy()
                                        })
                                      }
                                }
                          ><b>Apply</b></Button></td>
                  
                  </tr>
                  
                  );
          
          });
          
          //return the table of records
          return rows
    
    
        }
     }


     applyPolicy() {
      

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
              alert("Aadhaar available");
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
                      alert("Account address matches aadhaar mapping");

                      var policyTemplateContractAddress = this.state.appliedAddress
                      var policyTemplateABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"policyContracts","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_position","type":"uint256"}],"name":"getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_coverage","type":"uint256"},{"name":"_aadhaar","type":"uint256"}],"name":"newPolicy","outputs":[{"name":"newPolicyContract","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"getContractCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"policyContractAddress","type":"address"}],"name":"newPolicyPurchase","type":"event"}]
                      var policyTemplateContract = new this.state.web3.eth.Contract(policyTemplateABI, policyTemplateContractAddress)
                      this.policyTemplateContract = policyTemplateContract
                      console.log(this.policyTemplateContract)
                      alert(this.state.coverage)
                      alert(sessionStorage.getItem('aadhaar'))
                      alert(this.state.appliedAddress)

                      //Creating the policy contract
                      this.policyTemplateContract.methods.newPolicy(this.state.coverage, sessionStorage.getItem('aadhaar')).send(
                        {
                          from: accounts[0],
                          gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei')),
                          value:this.state.web3.utils.toHex(this.state.web3.utils.toWei('1','ether'))
                        })
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
     //don't render if not loaded
     if(this.state.insuranceCompanies.length != this.state.insuranceAdds.length) {
      return <div></div>
    }

      //render if loaded
   else {
    return (
      <div className="animated fadeIn">
           
           <Row>
          <Col md="9" lg="12" xl="12">
        <Card>
       
          <CardHeader>
            <strong>Hospital</strong>
          </CardHeader>
          <CardBody>
              <FormGroup row>
               
                <Col xs="12" md="6">
                  <Input type="select" required={true} defaultValue="no-value" onChange={event => {
                    this.setState({ insuranceAddress:event.target.value })
                    }}>
                    <option value="no-value" disabled>Select Insurance Company</option>
                    {this.insurancePopulate(this.state.insuranceAdds)}
                  </Input>
                  
                </Col>
              </FormGroup>

              <Table responsive striped>
                  <thead>
                  <tr>
                    <th>Policy Address</th>
                    <th>Coverage</th>
                    <th>Record Type</th>
                    <th>Hospital Name</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.showPolicies(this.state.insuranceAddress)}
                  </tbody>
                </Table>                           
          </CardBody>

          <CardFooter>
            {/* <Row>
              <Col md="2" sm="3" xs="6">
              <Button type="submit" size="md" color="primary">
              <i className="fa fa-dot-circle-o" /> Submit
            </Button>
              </Col> 
              <Col md="2" sm="3" xs="6">
              <Button type="reset" size="md" color="danger">
              <i className="fa fa-ban" /> Reset
            </Button>
              </Col>
            </Row> */}
          </CardFooter>
         
        </Card>
        </Col>
        </Row>
        </div>
   
    );
   }
      
     

     }
    
  }
  

  export default ApplyPolicy;