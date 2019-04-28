import React, { Component } from "react";
import { Link } from "react-router-dom";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import { organization } from "../../../contract_abi";
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from "reactstrap";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    const orgContractAddress = organization.contract_address;
    const orgABI = organization.abi;
    var orgContract = new this.state.web3.eth.Contract(
      orgABI,
      orgContractAddress
    );
    this.orgContract = orgContract;
    console.log("org contract: " + this.orgContract);
  }

  signIn(event) {

    event.preventDefault(); //function handling the signup event
    
    //get the account from metamask
    this.state.web3.eth.getAccounts((error, accounts) => {

      //get the details of the organization trying to login
      this.orgContract.methods.getOrgDetails(accounts[0]).call(
        { from: accounts[0] },
        function(error, details) {
          let id = details[2];
          console.log("id returned: " + id);

          if (this.state.orgId == id) {
            alert("sign in successful");
            sessionStorage.setItem("orgId", this.state.orgId);
            sessionStorage.setItem("orgType", details[1]);
            this.props.history.push("/dashboard");
          } 
          else {
            alert("Incorrect details");
          }
        }.bind(this)
      );
    });
  }

  render() {
    if (sessionStorage.getItem("orgId") != null)
      this.props.history.push("/dashboard");
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
                      <p className="text-muted">Sign In to your account</p>
                      <br />
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
