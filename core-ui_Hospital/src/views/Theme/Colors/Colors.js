import React, { Component } from "react";
import { Link, BrowserRouter, Route, Redirect } from "react-router-dom";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {organization, policyTemplate} from "../../../contract_abi";

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
} from "reactstrap";


class Colors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //declaring state variables
      orgId: "",
      web3: null,
      currentAddress: null,
      phone: null,
      seedphrase: ""
    };
    this.deployPolicyTemplate = this.deployPolicyTemplate.bind(this)

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }


  instantiateContract() {
   //Initialize organization contract
   const orgContractAddress = organization.contract_address
   const orgABI = organization.abi
   var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
   this.orgContract = orgContract
   console.log("org contract: "+this.orgContract)
  }

  //function to deploy policy templates
  deployPolicyTemplate(event) {
    event.preventDefault()

    this.state.web3.eth.getAccounts((error, accounts) => {
      if(error) {
        console.log(error)
      }
      else {
        alert(accounts[0])
        this.state.web3.eth.sendTransaction({
          from:accounts[0],
          data: policyTemplate.bytecode
        }).then((receipt) =>{
          console.log("Receipt:",receipt.contractAddress)
          this.orgContract.methods.addPolicy(receipt.contractAddress).send(
            {from:accounts[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))}).then(() => {
              alert("Mapping in organization.sol made")
            })  
        })
      }
     
    })
  }

  render() {
    return (
      <div className="App">
        <div className="animated fadeIn">
        <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
          <Card>
          <Form
                onSubmit={this.deployPolicyTemplate}
                method="post"
                encType="multipart/form-data"
                className="form-horizontal">
            
            <CardHeader>
              <strong>Deploy Policy Template</strong>
            </CardHeader>
            <CardBody>
              
{/*                 
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Enter patient's Aadhaar:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      placeholder="Aadhaar Card No."
                      onChange={event =>
                        this.setState({ aadhaar: event.target.value })
                      }
                      required={true}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="input">Record Name:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      placeholder="Record Name"
                      onChange={event =>
                        this.setState({ rname: event.target.value })
                      }
                      required={true}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="select">Record Type:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="select" onChange={event => this.setState({ rtype:event.target.value })} required={true} defaultValue="no-value">
                      <option value="no-value" disabled>Select Record Type</option>
                      <option value="Routine">Routine</option>
                      <option value="Sensitive">Sensitive</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Claim">Claim</option>
                    </Input>
                  </Col>
                </FormGroup>
                
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="file-input">Upload File:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="file" onChange={this.captureFile} required={true}/>
                  </Col>
                </FormGroup> */}
                            
            </CardBody>

            <CardFooter>
              <Row>
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
              </Row>
            </CardFooter>
            </Form>
          </Card>
          </Col>
          </Row>
      </div>
      </div>
    );
  }
}

export default Colors;
