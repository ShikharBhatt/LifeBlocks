import React, { Component } from "react";
import { Link, BrowserRouter, Route, Redirect } from "react-router-dom";
//import { Redirect} from 'react-router';
import { firebaseApp } from "../../../Dependencies/firebase";
import * as firebase from "firebase";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
//import '../App.css'
import { registerkey } from "../../../Dependencies/pgp";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

class Login extends Component {
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
    this.signIn = this.signIn.bind(this);
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
   const orgContractAddress = "0xf5e9037a2412db50c74d5a1642d6d3b99dd90f20"
   const orgABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"orgAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"orgToAddress","outputs":[{"name":"orgName","type":"string"},{"name":"orgType","type":"string"},{"name":"uniqueIdentifier","type":"uint256"},{"name":"keyHash","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getKeyHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_type","type":"string"},{"name":"_identifier","type":"uint256"},{"name":"_ipfsHash","type":"string"}],"name":"orgSignUp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"retAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getOrgName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getOrgType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getOrgDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"orgToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
   var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
   this.orgContract = orgContract
   console.log("org contract: "+this.orgContract)
  }

  signIn(event) {
    event.preventDefault(); //function handling the signup event
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.orgContract.methods.getOrgDetails(accounts[0]).call({from:accounts[0]},function(error,details){
          let id = details[2]
          console.log("id returned: "+id)
          if(this.state.orgId == id){
            alert("sign in successful")
            sessionStorage.setItem("orgId", this.state.orgId);
            this.props.history.push("/dashboard");
          }
          else{
            alert("Incorrect details")
          }
      }.bind(this))
    })
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form id="signIn" onSubmit={this.signIn}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p><br/>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-building" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Organization Identifier"
                          pattern=".{10,10}"
                          min="0000000001"
                          autoComplete="username"
                          onChange={event =>
                            this.setState({ orgId: event.target.value })
                          }
                          required={true}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="12" sm="12">
                          <Button
                            color="primary"
                            type="submit"
                            className="px-4"
                            block
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Before you register, please create an Ethereum account
                        using Metamask Google Chrome Extension and set the
                        network to http://localhost:7545.
                      </p>
                      <Link to="/register">
                        <Button
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
