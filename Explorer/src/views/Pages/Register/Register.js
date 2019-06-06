import React, { Component } from "react";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import { Link } from "react-router-dom";
import { registerkey } from "../../../Dependencies/pgp";
import { organization } from "../../../contract_abi";
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardFooter } from "reactstrap";


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
    //Initialize organization contract
    const orgContractAddress = organization.contract_address;
    const orgABI = organization.abi;
    var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress);
    this.orgContract = orgContract;
    console.log("org contract: " + this.orgContract);
  }

  //function handling the signup event
  signUp(event) {
    event.preventDefault();
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log("orgName: " + this.state.orgName);
      console.log("orgType: " + this.state.orgType);
      console.log("orgId: " + this.state.orgId);
      console.log("seedphrase: " + this.state.seedphrase);
      console.log("account address: " + accounts[0]);

      //create pgp key from seedphrase and get its ipfshash
      registerkey(
        accounts[0],
        this.state.seedphrase,
        function (ipfsHash) {
          console.log("callback ipfs: " + ipfsHash);
          alert("callback ipfs: " + ipfsHash);
          //create structure with organization information in smart contract
          this.orgContract.methods
            .orgSignUp(
              this.state.orgName,
              this.state.orgType,
              this.state.orgId,
              ipfsHash
            )
            .send(
              {
                from: accounts[0],
                gasPrice: this.state.web3.utils.toHex(
                  this.state.web3.utils.toWei("0", "gwei")
                )
              },
              function (error, txHash) {
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

  render() {
    if (sessionStorage.getItem("orgId") !== null)
      this.props.history.push("/dashboard");
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form id="orgRegister" onSubmit={this.signUp}>
                    <h1>Register</h1>
                    <p className="text-muted">
                      Create an account for your organization
                    </p>

                    {/* select organization type */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-building " />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="select"
                        onChange={event =>
                          this.setState({ orgType: event.target.value })
                        }
                        required={true}
                        defaultValue="no-value"
                      >
                        <option value="no-value" disabled>
                          Select Organization Type
                        </option>
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
                <CardFooter className="p-4">
                  <Row>
                    <Col
                      xs="9"
                      sm="9"
                      style={{ marginTop: "2%", textAlign: "right" }}
                    >
                      Already Registered?
                    </Col>
                    <Col xs="3" sm="3">
                      <Link to="/login">
                        <Button className="btn-facebook mb-1" block>
                          <span>Login</span>
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
