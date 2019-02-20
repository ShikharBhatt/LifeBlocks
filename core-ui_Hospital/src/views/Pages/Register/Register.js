import React, { Component } from "react";
import { Link, browserHistory } from "react-router-dom";
import { firebaseApp } from "../../../Dependencies/firebase";
import * as firebase from "firebase";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
//import '../App.css'
import { registerkey } from "../../../Dependencies/pgp";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";

class Register extends Component {
  constructor(props) {
    super(props);

    //declaring state variables
    this.state = {
      orgName: "",
      orgType: "",
      orgId: "",
      web3: null,
      currentAddress: null,
      phone: null,
      seedphrase: ""
    };
    this.signUp = this.signUp.bind(this);  
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
    //Initialize storage contract
    const storageContractAddress = "0xf3f0fac080e7babdc06dc5a2e2f68f36116a31c0";
    const storageABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"ipfsHash","type":"string"},{"name":"rtype","type":"string"},{"name":"rname","type":"string"},{"name":"date","type":"uint256"},{"name":"Hospital","type":"string"},{"name":"masterkey","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"RecordtoOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"OwnerRecordCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"viewRecord","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"retrieve","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfsHash","type":"string"},{"name":"_type","type":"string"},{"name":"_name","type":"string"},{"name":"_masterkey","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    var storageContract = new this.state.web3.eth.Contract(storageABI, storageContractAddress);
    this.storageContract = storageContract;
    console.log("storage contract: " + this.storageContract);

    //Initialize organization contract
    const orgContractAddress = "0xf5e9037a2412db50c74d5a1642d6d3b99dd90f20"
    const orgABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"orgAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"orgToAddress","outputs":[{"name":"orgName","type":"string"},{"name":"orgType","type":"string"},{"name":"uniqueIdentifier","type":"uint256"},{"name":"keyHash","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getKeyHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_type","type":"string"},{"name":"_identifier","type":"uint256"},{"name":"_ipfsHash","type":"string"}],"name":"orgSignUp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"retAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getOrgName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getOrgType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getOrgDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"orgToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
    var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
    this.orgContract = orgContract
    console.log("org contract: "+this.orgContract)
  }

  signUp(event) {
    //function handling the signup event
    event.preventDefault();
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log("orgName: "+this.state.orgName)
      console.log("orgType: "+this.state.orgType)
      console.log("orgId: "+this.state.orgId)
      console.log("seedphrase: "+this.state.seedphrase)
      console.log("account address: "+accounts[0])

      //create pgp key from seedphrase and get its ipfshash
      registerkey(accounts[0],this.state.seedphrase,function(ipfsHash){
        console.log("callback ipfs: " + ipfsHash)
        alert("callback ipfs: " + ipfsHash)
        //create structure with organization information in smart contract
        this.orgContract.methods.orgSignUp(this.state.orgName,this.state.orgType,this.state.orgId,ipfsHash).send({from: accounts[0],gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei("0", "gwei"))},function(error, txHash) {
          if (!error) {
            console.log("tx: " + txHash);
            alert("Transaction Hash:" + txHash);
            alert("Registered Successfully");
            window.location.reload(true);
          } else console.log(error);
        })
      }.bind(this))
    })
  }
  
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form id="orgRegister" onSubmit={this.signUp}>
                    <h1>Register</h1>
                    <p className="text-muted">Create an account for your organization</p>
                    
                    {/* select organization type */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-building " />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="select" onChange={event => this.setState({ orgType:event.target.value })} required={true}>
                        <option selected disabled>Select Organization Type</option>
                        <option value="Hospital">Hospital</option>
                        <option value="Insurance">Insurance Company</option>
                      </Input>
                    </InputGroup>

                    {/* input organization name */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" /> 
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Organization Name"
                        autoComplete="username"
                        onChange={event =>
                          this.setState({ orgName: event.target.value })
                        }
                        required={true}
                      />
                    </InputGroup>
                    
                    {/* input organization identifier */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-clipboard" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Organization Identifier"
                        autoComplete="username"
                        onChange={event =>
                          this.setState({ orgId: event.target.value })
                        }
                        required={true}
                      />
                    </InputGroup>

                    {/* enter seedphrase */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-asterisk" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Seed Phrase"
                        autoComplete="new-password"
                        onChange={event =>
                          this.setState({ seedphrase: event.target.value })
                        }
                        required={true}
                      />
                    </InputGroup>
                    
                    {/* enter secret key */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-key" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        id="secret"
                        placeholder="Enter shared secret"
                        required={true}
                      />
                    </InputGroup>

                    <Button color="success" type="submit" block>
                      Submit
                    </Button>

                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
