import React, { Component } from "react";
import { Link, BrowserRouter, Route, Redirect } from "react-router-dom";
import { firebaseApp } from "../../../Dependencies/firebase";
import * as firebase from "firebase";
import {userdetails} from "../../../contract_abi";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
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
      aadhaar: "",
      web3: null,
      phone: null,
      seedphrase: ""
    };
    this.SignIn = this.SignIn.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
    this.validateOTP = this.validateOTP.bind(this);
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

  componentDidMount() {
    document.getElementById("OTP").style.display = "none";
  }

  instantiateContract() {
    //User Details contract instantiation
    const contractAddress = userdetails.contract_address;

    //ABI for User Details contract
    const ABI = userdetails.abi

    //initializing the contract 
    var UserDetailsContract = new this.state.web3.eth.Contract(ABI, contractAddress);

    this.UserDetailsContract = UserDetailsContract;
    console.log("userdetails contract:" + this.UserDetailsContract);
  }

  SignIn(event) {
    event.preventDefault(); //function handling the signup event
    document.getElementById("OTP").style.display = "block";
    alert("In Signup");
    //getting phone number for the entered aadhaar number
    firebaseApp
      .database()
      .ref("/uidai/")
      .orderByChild("aadhaar_no")
      .equalTo(this.state.aadhaar)
      .once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(child) {
          var value = child.val();

          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container"
          );

        //send OTP to the phone number
          firebaseApp
            .auth()
            .signInWithPhoneNumber(
              "+91" + value.phone,
              window.recaptchaVerifier
            )
            .then(function(confirmationResult) {
              //wait for OTP verification
              window.confirmationResult = confirmationResult;
            });
        });
      });
  }

  //link aadhaar to account address using Smart Contract
  verifyLogin() {
    this.state.web3.eth.getAccounts((error, accounts) => {
      //get the account from metamask
      console.log("Account:",accounts[0])
      this.UserDetailsContract.methods.login(this.state.aadhaar).call(
        { from: accounts[0] },
        function(error, x) {
          //check if account exists
          if (error) {
            alert("Wrong");
            return;
          }
          if (x === true) {
            alert("Login Successfull");
            //get address from aadhaar number
            this.UserDetailsContract.methods
              .getAddress(this.state.aadhaar)
              .call(
                { from: accounts[0] },
                function(error, add) {
                  //get account address from SC
                  if (error) {
                    alert("Wrong");
                    return;
                  }
                  if (add === accounts[0]) {
                    alert("Login Successfull");

                    //setting a key value pair ::>> "aadhaar" : this.state.aadhaar
                    sessionStorage.setItem("aadhaar", this.state.aadhaar);
                    this.props.history.push("/dashboard");

                    //this.props.dispatch(logUser(this.state.aadhaar))    //if login successful then store aadhaar in app state
                  } else {
                    alert("Details Incorrect");
                  }
                }.bind(this)
              );
          } else {
            alert("Details Incorrect");
          }
        }.bind(this)
      );
    });
  }

  //confirm OTP function and call to linkAadhaar function
  validateOTP = function(event) {
    event.preventDefault();
    let verifyLogin = this.verifyLogin;
    // verifyLogin()
    window.confirmationResult
      .confirm(document.getElementById("verificationcode").value)
      .then(
        function(result) {
          verifyLogin();
          //window.location.href = '/signin'
          alert("success");
        },

        function(error) {
          alert(error);
        }
      );
  };

  render() {
    //checking if already logged in and redirecting to /dashboard (2 ways)
    if (sessionStorage.getItem("aadhaar") !== null)
      //return (window.location.href = "/dashboard");
      this.props.history.push("/dashboard");
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.SignIn}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Aadhaar Number"
                          pattern=".{10,10}"
                          min="0000000001"
                          autoComplete="username"
                          onChange={event =>
                            this.setState({ aadhaar: event.target.value })
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
                            Get OTP
                          </Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col> */}
                      </Row>
                    </Form>
                    <br />
                    <div id="recaptcha-container" />
                    <br />

                    <Form id="OTP" onSubmit={this.validateOTP}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          pattern=".{6,6}"
                          min="000000"
                          id="verificationcode"
                          placeholder="Enter OTP"
                          required={true}
                        />
                      </InputGroup>

                      <Button color="primary" type="submit" block>
                        Submit
                      </Button>
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
