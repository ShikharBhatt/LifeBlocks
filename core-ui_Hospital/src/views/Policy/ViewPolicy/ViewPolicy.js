import React, { Component } from "react";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import { Button, Card, CardBody, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter, Table } from "reactstrap";
import {userdetails, organization, policy} from "../../../contract_abi";


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
        stateMap:{0:'AppliedWOR', 1:'Applied', 2:'AppliedSP', 3:'Active', 4:'Grace', 5:'Lapsed', 6:'RenewalWOR', 7:'Renewal', 8:'Inactive', 9:'Defunct', 10:'NA'},
        policyDetails:['NA', 'NA', 'NA', 10, 'NA', 'NA', 'NA', 'NA', 'NA', 'NA']
      };
  
      this.getDate = this.getDate.bind(this)
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

      const {data} = this.props.location
      //Get account from metamask
          
      await this.viewPolicy(data)
          
              
      }
  
    viewPolicy(contractAddress) {
      
     this.state.web3.eth.getAccounts((error, accounts) => {
        //get the account from metamask
                        
            //Policy Contract Instantiation
            const policyContractAddress = contractAddress       
            const policyABI = policy.abi              
            var policyContract = new this.state.web3.eth.Contract(policyABI, policyContractAddress)     
            
            console.log("Address: ",contractAddress)
            if(policyContract)
              policyContract.methods.getPremium().call(
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
                  policyContract.methods.getDetails()
                  .call(
                    {from: accounts[0]},
                    (error, details) => {
                      
                      this.setState({
                        policyDetails: details
                      })
                      
                      console.log("Details:",details)
                    }
                  )
                }
              )
            

      });
  
    }

    getDate(number) {
      let f = Number(number)
      f = new Date(f*1000).toLocaleDateString()
      if(f==='01/01/1970')
        f = "NA"
      return f                 
    }

   render() {
    const {data} = this.props.location
    console.log(data)
    if(data==null) {
      return(
        <div>Go back to accept policy page and try again!</div>
      );
    }
    else if (data!=null){
      return (
        <div className="animated fadeIn">
             
             <Row>
            <Col md="9" lg="12" xl="12">
          <Card>
         
            <CardHeader>
              <strong>My Policy Details</strong>
            </CardHeader>
            <CardBody>
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
                <td>{this.state.premium}</td>
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
                <td>{this.state.policyDetails[9]}</td>
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
  

  export default ViewPolicy;