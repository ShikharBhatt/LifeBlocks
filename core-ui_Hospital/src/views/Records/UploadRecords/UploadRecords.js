import React, { Component } from "react";
import { Button, Card, CardBody, CardColumns, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter } from "reactstrap";
import ipfs from "../../../Dependencies/ipfs";
import { encrypt } from "../../../Dependencies/crypto";
import { getKeys, keyEncrypt } from "../../../Dependencies/pgp";
import { userdetails, storage, policy, organization, policyTemplate } from "../../../contract_abi";
import getWeb3 from "../../../Dependencies/utils/getWeb3";

//prints on console what type of organization is logged in - hospital or insurance company
console.log("Type:", sessionStorage.getItem("orgType"));

class UploadRecords extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aadhaar: "",
      rtype: "",
      ipfsHash: "",
      web3: null,
      buffer: null,
      account: null,
      currentAccount: null,
      userAddress: "",
      rname: "",
    };


    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }

  async componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    await getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

      })
      .catch(() => {
        console.log("Error finding web3.");
      });
    // Instantiate contract once web3 provided.
    await this.instantiateContract();

  }

  async instantiateContract() {

    //Initialize user details contract
    const userContractAddress = userdetails.contract_address;
    const userABI = userdetails.abi;
    var userContract = new this.state.web3.eth.Contract(userABI, userContractAddress);
    this.userContract = userContract;
    //Initialize storage contract
    const storageContractAddress = storage.contract_address;
    const storageABI = storage.abi;
    var storageContract = new this.state.web3.eth.Contract(storageABI, storageContractAddress);
    this.storageContract = storageContract;
    console.log(storageContract)
    //Organizaton
    const orgContractAddress = organization.contract_address
    const orgABI = organization.abi
    var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
    this.orgContract = orgContract
    //Initialize Policy contract
   

  }

  captureFile(event) {
    event.preventDefault();

    const file = event.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.buffer = Buffer(reader.result);
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async onSubmit(event) {
    event.preventDefault();
    console.log(this.buffer);
    var encrypted = encrypt(this.buffer);
    const masterkey = encrypted[0];
    this.buffer = Buffer(encrypted[1]);
    console.log(masterkey);
    console.log(encrypted);
    let keyObj, m_key, record;

    record = this.buffer;
    await this.state.web3.eth.getAccounts(async (error, accounts) => {
      //transaction to link aadhaar card to address
      await this.userContract.methods
        .getKeyHash(this.state.aadhaar)
        .call({
          from: accounts[0],
          gasPrice: this.state.web3.utils.toHex(
            this.state.web3.utils.toWei("0", "gwei")
          )
        })
        .then(ipfsHash => {
          getKeys(ipfsHash, function (key) {
            //in callback function of getKeys
            keyObj = JSON.parse(key);
            //console.log(this.state.aadhaar)
            console.log("key object: " + keyObj);
            console.log("key object type: " + typeof keyObj);
            console.log("public key : " + keyObj.publicKeyArmored);
            console.log(Object.getOwnPropertyNames(keyObj));
            keyEncrypt(masterkey, keyObj, function (cipher) {
              //in callback function of keyEncrypt
              m_key = cipher;
              console.log("encrypted masterkey: " + m_key);
            });
          });
        });

      //add the record to ipfs  
      await ipfs.files.add(record, (error, result) => {
        if (error) {
          console.error(error);
          return;
        } else {

          alert(result[0].hash + this.state.aadhaar + this.state.rtype + this.state.rname);
          alert(m_key);

          this.storageContract.methods.upload(this.state.aadhaar, result[0].hash, this.state.rtype, this.state.rname, m_key)
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
                  alert("Record Uploaded Successfully");
                  window.location.reload(true);
                } else console.log(error);
              }
            );
        }
      });
    });
  }

  render() {


    //if hospital logged in then render this

      console.log(localStorage.hosp)
     

      return (
        <div className="App">
          <div className="animated fadeIn">
            <Row className="justify-content-center">
              <Col md="9" lg="7" xl="6">
                <Card>
                  <Form
                    onSubmit={this.onSubmit}
                    method="post"
                    encType="multipart/form-data"
                    className="form-horizontal"
                  >
                    <CardHeader>
                      <strong>Hospital</strong>
                    </CardHeader>
                    <CardBody>
                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">
                            Enter patient's Aadhaar:
                          </Label>
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
                          <Input
                            type="select"
                            onChange={event =>
                              this.setState({ rtype: event.target.value })
                            }
                            required={true}
                            defaultValue="no-value"
                          >
                            <option value="no-value" disabled>
                              Select Record Type
                            </option>
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
                          <Input
                            type="file"
                            onChange={this.captureFile}
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


export default UploadRecords;
