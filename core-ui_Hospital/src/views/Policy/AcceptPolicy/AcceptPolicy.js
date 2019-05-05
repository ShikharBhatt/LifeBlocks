import React, { Component } from "react";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import { Link, BrowserRouter, Route, Redirect } from "react-router-dom";
import {organization, policyTemplate, userdetails} from "../../../contract_abi";
import { Button, Card, CardBody, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter, Table } from "reactstrap";


class AcceptPolicy extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userAddress : '',
      selectValue: '',
      account: null,
      value:'',
      web3:null,
      coverage:'-',
      insuranceAdds:[],
      insuranceCompanies: [],
      insurancePolicies: [],
      insuranceAddress:null,
      insuranceName:null,
      appliedAddress: '',
      templateAddress: null,
      contractCount: null,
      policiesGenerated: [],
      policyTemplateDetails: []
    };

    this.policyTemplatePopulate = this.policyTemplatePopulate.bind(this)
    this.showPolicies = this.showPolicies.bind(this);
    this.getPolicies = this.getPolicies.bind(this);
    this.coverage = '-'
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

    //Get account from metamask
        await this.state.web3.eth.getAccounts((error,accounts) => {
        if(!error) {
          console.log(accounts[0])
          this.setState({
            account: accounts[0]
          })

          this.orgContract.methods.getOrgDetails(accounts[0]).call(
            {from: accounts[0]}, (error, details) => {
              if(!error) {
                if(details[2] === sessionStorage.getItem("orgId")) {
                  this.orgContract.methods.returnAllPolicy(accounts[0]).call(
                    {from: this.state.account}, (error, policies) => {
                      if(!error) {
                        
                        this.setState({
                          insurancePolicies: policies
                        })
                        const templateABI = policyTemplate.abi
                        let myarray = []
                        for(let i=0;i<policies.length; i++) {
                          let obj = { }
                          var templateContractAddress = policies[i]                         
                          var templateContract = new this.state.web3.eth.Contract(templateABI, templateContractAddress)
                          
                          templateContract.methods.getPolicyDetails().call(
                            {from: accounts[0]}, (error, details) => {
                              if(!error) {
                                obj['coverage'] = details[0]
                                obj['policyName'] = details[1]
                                obj['policyAddress'] = policies[i]
                                myarray.push(obj)
                                this.setState({policyTemplateDetails:myarray})
                              }
                            }
                          )
                  
                        }
                      }
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

    //populate the insurance companies drop down menu
    policyTemplatePopulate(insurancePolicies) {

      const rows =  insurancePolicies.map((row, index) => {
            return (
                <option key={index} value={row.policyAddress}>
                  {row.policyName}
                </option>
                );
        
        });
        
        //return the table of records
        return rows
    }

    //get the policies corresponding to the policy template selected
    getPolicies(tempAdd)
    {
      if(tempAdd) {
        const templateContractAddress = tempAdd
        const templateABI = policyTemplate.abi
        var templateContract = new this.state.web3.eth.Contract(templateABI, templateContractAddress)
        this.templateContract = templateContract
  
        this.templateContract.methods.getContractCount().call(
          {from: this.state.account}, (error, count) => {
            if(!error) {
              
            // if( count != 0) {
                let policiesGenerated = []
               
                for(let i=count-1; i>=0; i--) {
                  
                  this.templateContract.methods.getContract(i).call(
                    {from: this.state.account}, (error, address) => {
                      if(!error) {
                        policiesGenerated.push(address)
                        this.setState({
                          policiesGenerated: policiesGenerated
                        })
                      }
                    })
              }
              this.setState({policiesGenerated: policiesGenerated})
         // }
            }
          })
      }
    }
   //show policies based on the insurance company selected 
    showPolicies(policiesGenerated) {
                
          const rows = policiesGenerated.map((row, index) => {
            return (
                <tr key={index}>
               
                    <td>{row}</td>
                    {/* <td>{row.job}</td> */}
                    
                   
                    <td>
                      <Link 
                        to={{
                          pathname: "/Policy/ViewPolicy",
                          data:row  // your data array of objects
                        }}
                      >
                      <Button
                      
                      block color="primary" 
                      size="lg"
                      value={row} 
                      
                        ><b>View Application</b></Button></Link></td>
                
                </tr>
                
                );
        
        });
        
        //return the table of records
        return rows
  
  
      }
   




 render() {
   //don't render if not loaded
   if(this.state.insurancePolicies.length === 0) {
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
             
              <Col xs="12" md="6">
                <Input type="select" required={true} defaultValue="no-value" onChange={event => {
                  this.setState({ templateAddress:event.target.value,
                  })
                  this.getPolicies(event.target.value)
                  }}>
                  <option value="no-value" disabled>Select Policy</option>
                  {this.policyTemplatePopulate(this.state.policyTemplateDetails)}
                </Input>
                
              </Col>
            </FormGroup>

            <Table responsive striped>
                <thead>
                <tr>
                  <th>Policy Contract </th>
                </tr>
                </thead>
                <tbody>
                  {this.showPolicies(this.state.policiesGenerated)}
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
    
   

   }}

export default AcceptPolicy;
