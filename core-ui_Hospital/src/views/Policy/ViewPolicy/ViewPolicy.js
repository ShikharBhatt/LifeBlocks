import React, { Component } from "react";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {organization, policyTemplate, userdetails} from "../../../contract_abi";
import { Button, Card, CardBody, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter, Table } from "reactstrap";


class ViewPolicy extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userAddress : '',
      selectValue: '',
      account: null,
      value:'',
      web3:null,
     
      insuranceCompanies: [],
      insurancePolicies: [],
      
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

    //PolicyTemplate Contract Instantitation
    const templateABI = policyTemplate.abi

    //Policy Contract Instantiation
    // const policyContractAddress = this.state.policyAddress       
    // const policyABI = policy.abi              
    // var policyContract = new this.state.web3.eth.Contract(policyABI, policyContractAddress)     
    // this.policyContract = policyContract
    
    //Get account from metamask
        await this.state.web3.eth.getAccounts((error,accounts) => {
        if(!error) {
          console.log(accounts[0])
          this.setState({
            account: accounts[0]
          })
          this.orgContract.methods.returnAllPolicy(accounts[0]).call(
            {from: this.state.account}, (error, policies) => {
              if(!error) {
                
                this.setState({
                  insurancePolicies: policies
                })
              }
            })
        }
        else {
          console.log(error)
        }
 
      })              
    }

    componentDidMount() {
      const {data} = this.props.location
    console.log(data)
    }


 render() {
   //don't render if not loaded
   const { data } = this.props.location
   if(data===null) {
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
          <strong>Policies Generated</strong>
        </CardHeader>
        <CardBody>
            <FormGroup row>
             {data}
             
            </FormGroup>

                               
        </CardBody>

        <CardFooter>
          
        </CardFooter>
       
      </Card>
      </Col>
      </Row>
      </div>
 
  );
 }
    
   

   }}

export default ViewPolicy;
