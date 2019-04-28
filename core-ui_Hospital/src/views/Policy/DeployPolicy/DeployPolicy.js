import React, { Component } from "react";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import {organization, policyTemplate} from "../../../contract_abi";
import { Button, Card, CardBody, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter, Table } from "reactstrap";


class DeployPolicy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //declaring state variables
      orgId: "",
      web3: null,
      currentAddress: null,
      phone: null,
      seedphrase: "",
      coverage:null,
      policyName:null,
    };
    this.deployPolicyTemplate = this.deployPolicyTemplate.bind(this);

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
        alert(this.state.coverage)
        alert("Name:" + this.state.policyName)
        alert(accounts[0], this.state.coverage, this.state.policyName)
        
        const policyScheme = new this.state.web3.eth.Contract(policyTemplate.abi);
        console.log(policyScheme);
        policyScheme.deploy({
          data:policyTemplate.bytecode,
          arguments:[this.state.coverage, this.state.policyName]
        }).send({
          from:accounts[0]  
        }).then((newContractInstance) => {
          console.log(newContractInstance.options.address) // instance with the new contract address
          //create mapping in the organization contract - (template => organization)
          this.orgContract.methods.addPolicy(newContractInstance.options.address).send(
            {from:accounts[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))}).then(() => {
              alert("Mapping in organization.sol made")
            })
      });
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
              
                 
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Enter Policy Coverage:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      placeholder="Coverage"
                      onChange={event =>
                        this.setState({ coverage: event.target.value })
                      }
                      required={true}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Enter Policy Name:</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      placeholder="Policy Name"
                      onChange={event =>
                        this.setState({ policyName: event.target.value })
                      }
                      required={true}
                    />
                  </Col>
                </FormGroup>

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

export default DeployPolicy;
