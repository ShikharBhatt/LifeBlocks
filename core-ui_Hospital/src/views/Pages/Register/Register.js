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
  Row
} from "reactstrap";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //declaring state variables
      aadhaar: "",
      web3: null,
      currentAddress: null,
      phone: null,
      seedphrase: ""
    };
    this.SignUp = this.SignUp.bind(this);
    this.linkAadhaar = this.linkAadhaar.bind(this);
    this.myFunction = this.myFunction.bind(this);
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
    const contractAddress = "0x78478e7666bcb38b2ddeddfe7cb0ba152301df07";

    const ABI = [
      {
        constant: true,
        inputs: [{ name: "_aadhaar", type: "uint256" }],
        name: "login",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "uint256" }],
        name: "aadhaarToAddress",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "_ipfskey", type: "string" }],
        name: "keymap",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_aadhaar", type: "uint256" },
          { name: "_ipfskey", type: "string" }
        ],
        name: "link",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "addressToAadhaar",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "_aadhaar", type: "uint256" }],
        name: "getAddress",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "ownerToKey",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, name: "_address", type: "address" },
          { indexed: false, name: "_aadhaar", type: "uint256" }
        ],
        name: "addressLinked",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, name: "_address", type: "address" },
          { indexed: false, name: "_ipfshash", type: "string" }
        ],
        name: "keyLinked",
        type: "event"
      }
    ];

    var UserDetailsContract = new this.state.web3.eth.Contract(
      ABI,
      contractAddress
    );

    this.UserDetailsContract = UserDetailsContract;
    console.log("contract:" + this.UserDetailsContract);

    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts[0]);
      this.acc = accounts[0];
      console.log(this.acc);
      this.setState({ currentAddress: this.acc });
    });
    this.setState({ currentAddress: this.acc });
    console.log(this.state.web3);
    //console.log(this.UserDetailsContract)
  }

  SignUp(event) {
    //function handling the signup event
    event.preventDefault();
    document.getElementById("OTP").style.display = "block";

    alert("In Signup");
    //getting phone number for the entered aadhaar number

    // firebaseApp
    //   .database()
    //   .ref("/uidai/")
    //   .orderByChild("aadhaar_no")
    //   .equalTo(this.state.aadhaar)
    //   .once("value")
    //   .then(function(snapshot) {
    //     snapshot.forEach(function(child) {
    //       var value = child.val();

    //       window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //         "recaptcha-container"
    //       );

    //       //     //send OTP to the phone number
    //       firebaseApp
    //         .auth()
    //         .signInWithPhoneNumber(
    //           "+91" + value.phone,
    //           window.recaptchaVerifier
    //         )
    //         .then(function(confirmationResult) {
    //           //wait for OTP verification
    //           window.confirmationResult = confirmationResult;
    //         });
    //     });
    //   });
  }

  //link aadhaar to account address using Smart Contract
  linkAadhaar() {
    this.state.web3.eth.getAccounts((error, accounts) => {
      alert("aadhaar:", this.state.aadhaar);
      alert("seedphrase:", this.state.seedphrase);
      registerkey(
        accounts[0],
        this.state.seedphrase,
        function(ipfsHash) {
          console.log("callback ipfs: " + ipfsHash);
          alert("callback ipfs: " + ipfsHash);
          alert(accounts[0]);
          console.log(this.UserDetailsContract);
          //transaction to link aadhaar card to address
          this.UserDetailsContract.methods
            .link(this.state.aadhaar, ipfsHash)
            .send(
              {
                from: accounts[0],
                gasPrice: this.state.web3.utils.toHex(
                  this.state.web3.utils.toWei("0", "gwei")
                )
              },
              function(error, txHash) {
                if (!error) {
                  console.log("tx: " + txHash);
                  alert("Transaction Hash:" + txHash);
                  alert("Registered Successfully");
                  window.location.reload(true);
                } else console.log(error);
              }
            );
        }.bind(this)
      );
    });
  }

  //confirm OTP function and call to linkAadhaar function
  myFunction = function(event) {
    event.preventDefault();
    let callLinkAadhaar = this.linkAadhaar;
    callLinkAadhaar();
    // window.confirmationResult
    //   .confirm(document.getElementById("verificationcode").value)
    //   .then(
    //     function(result) {
    //       callLinkAadhaar();
    //       //window.location.href = '/signin'
    //       alert("success");
    //     },

    //     function(error) {
    //       alert(error);
    //     }
    //   );
  };

  render() {
    if (sessionStorage.getItem("aadhaar") !== null)
      //  return (window.location.href = "/dashboard");
      this.props.history.push("/dashboard");
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.SignUp}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Aadhaar Number"
                        autoComplete="username"
                        onChange={event =>
                          this.setState({ aadhaar: event.target.value })
                        }
                        required={true}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
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

                    <Button color="success" type="submit" block>
                      Get OTP
                    </Button>
                  </Form>
                  <br />
                  <div id="recaptcha-container" />
                  <br />
                  <Form id="OTP" onSubmit={this.myFunction}>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="verificationcode"
                        placeholder="Enter OTP"
                        required={true}
                      />
                    </InputGroup>

                    <Button color="success" type="submit" block>
                      Submit
                    </Button>
                  </Form>
                </CardBody>
                {/* <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="12">
                      <Link to="/login">
                      <Button className="btn-facebook mb-1" block><span>Login</span></Button>
                      </Link>
                    </Col>
                  </Row>
                </CardFooter> */}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
