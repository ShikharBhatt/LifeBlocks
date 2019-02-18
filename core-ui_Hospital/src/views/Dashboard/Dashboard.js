import React, { Component } from "react";
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
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  DropdownItem
} from "reactstrap";

import ipfs from "../../Dependencies/ipfs";
import { encrypt } from "../../Dependencies/crypto";
// import "./css/oswald.css";
// import "./css/open-sans.css";
// import "./css/pure-min.css";

import getWeb3 from "../../Dependencies/utils/getWeb3";

const Web3 = require("web3");
const web3 = new Web3("http://localhost:7545");

console.log(web3);

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aadhaar: "",
      type: "",
      ipfsHash: "",
      web3: null,
      buffer: null,
      account: null,
      currentAccount: null,
      userAddress: "",
      rname: ""
    };

    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: new Array(19).fill(false)
    };
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
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const contractAddress = "0xf5e9037A2412db50c74d5A1642D6d3B99Dd90f20";
    const ABI = [
      {
        constant: true,
        inputs: [{ name: "", type: "uint256" }],
        name: "records",
        outputs: [
          { name: "ipfsHash", type: "string" },
          { name: "rtype", type: "string" },
          { name: "rname", type: "string" },
          { name: "Hospital", type: "address" },
          { name: "masterkey", type: "string" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "uint256" }],
        name: "RecordtoOwner",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "OwnerRecordCount",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "i", type: "uint256" }],
        name: "viewRecord",
        outputs: [
          { name: "", type: "string" },
          { name: "", type: "string" },
          { name: "", type: "string" },
          { name: "", type: "address" },
          { name: "", type: "string" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "_aadhaar", type: "uint256" }],
        name: "retrieve",
        outputs: [{ name: "", type: "uint256[]" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_aadhaar", type: "uint256" },
          { name: "_ipfsHash", type: "string" },
          { name: "_type", type: "string" },
          { name: "_name", type: "string" },
          { name: "_masterkey", type: "string" }
        ],
        name: "upload",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
    ];

    //console.log('constract Address : ',contractAddress)
    var RecordUploaderContract = new this.state.web3.eth.Contract(
      ABI,
      contractAddress
    );
    //console.log(RecordUploaderContract)
    this.RecordUploaderContract = RecordUploaderContract;

    // const contract = require('truffle-contract')
    // const simpleStorage = contract(SimpleStorageContract)
    // simpleStorage.setProvider(this.state.web3.currentProvider)

    // // Get accounts
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     this.simpleStorageInstance = instance
    //     this.setState({ account: accounts[0] })
    //     // Get the value from the contract to prove it worked.
    //     return this.simpleStorageInstance.get.call(accounts[0])
    //   }).then((ipfsHash) => {
    //     // Update state with the result.
    //     return this.setState({ ipfsHash })
    //   })
    // })
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

  onSubmit(event) {
    event.preventDefault();
    console.log(this.buffer);
    var encrypted = encrypt(this.buffer);
    const masterkey = encrypted[0];
    console.log(masterkey);
    console.log(encrypted);
    this.buffer = Buffer(encrypted[1]);
    console.log(this.buffer);
    ipfs.files.add(this.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      alert(
        "Aadhaar : " +
          this.state.aadhaar +
          "\nIPFSHash : " +
          result[0].hash +
          "\nType : " +
          this.state.type
      );

      this.state.web3.eth.getAccounts((error, accounts) => {
        this.RecordUploaderContract.methods
          .upload(
            this.state.aadhaar,
            result[0].hash,
            this.state.type,
            this.state.rname,
            "oyUL8cuKJvfTqxlf45aFVxvQI6qixU1rRWZRgOq1rq1dAnUBdtCZkvfqwl3lFNdb2UpNBx9nkM7RdxV4FTfObKHuHucTtbwxzYbRkoYMggQsR2NpPp79iKTtFT9OipJ0lUysfbNcDlREqrPdjjBadpeOsm5nPEz0byGj7uK8HuNJvQf1gK5OrlaXlDZAS4aspV2zYo0KpK3slaXMiIyKimqUuxEYTOK6vQFIPrmaZwCeAtF5VM6aOEqh7ojc9GTBS2BkrVPfGJUt917nJmu0FU3zj3HR4Yy7Cv6lt3DTMtGlnmBF3HqTLWbseb9FLfyoEUfuuWPKd6AJXCotr0JC95phz3287dRKMex82e8X6gcVF0XEsHbScV0eWO8ulNRATrkOpbRKHrZaLWzrJyOUvyKBzkXDjI7HhnkdQaSUhVp509VK"
          )
          .send(
            {
              from: accounts[0],
              gas: 600000000,
              gasPrice: this.state.web3.utils.toHex(
                this.state.web3.utils.toWei("0", "gwei")
              )
            },
            function(error, tx) {
              if (error) {
                console.log(error);
              } else {
                console.log(tx);
                alert(tx);
              }
            }
          );
      });

      // const txBuilder = this.RecordUploaderContract.methods.upload(
      //   this.state.aadhaar,
      //   result[0].hash,
      //   this.state.type,
      //   this.state.rname,
      //   'oyUL8cuKJvfTqxlf45aFVxvQI6qixU1rRWZRgOq1rq1dAnUBdtCZkvfqwl3lFNdb2UpNBx9nkM7RdxV4FTfObKHuHucTtbwxzYbRkoYMggQsR2NpPp79iKTtFT9OipJ0lUysfbNcDlREqrPdjjBadpeOsm5nPEz0byGj7uK8HuNJvQf1gK5OrlaXlDZAS4aspV2zYo0KpK3slaXMiIyKimqUuxEYTOK6vQFIPrmaZwCeAtF5VM6aOEqh7ojc9GTBS2BkrVPfGJUt917nJmu0FU3zj3HR4Yy7Cv6lt3DTMtGlnmBF3HqTLWbseb9FLfyoEUfuuWPKd6AJXCotr0JC95phz3287dRKMex82e8X6gcVF0XEsHbScV0eWO8ulNRATrkOpbRKHrZaLWzrJyOUvyKBzkXDjI7HhnkdQaSUhVp509VK');

      //   let encoded_tx = txBuilder.encodeABI();
      //   var addrHosp = "0xFB23cd312F5Da28dAeD5E6c7D76DA1c2Cf9c977F"
      //   var privHosp = "0x05dd9541d286146c393a60ea7f23d7f8ed14abd84728c00419d9cfbb2493f140"
      //   web3.eth.getTransactionCount(addrHosp, (err , txCount) => {
      //     //Transaction Object
      //     const txObject = {
      //         nonce : web3.utils.toHex(txCount),
      //         from:addrHosp,
      //         to: "0x78478E7666BCB38B2DdEddfE7cb0BA152301Df07",         //all paramters should be in Hex
      //         gasLimit : web3.utils.toHex(90000000),
      //         gasPrice : web3.utils.toHex(web3.utils.toWei('0','gwei')),
      //         data : encoded_tx
      //     }
      //     web3.eth.accounts.signTransaction(txObject, privHosp, function (error, signedTx) {

      //         web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      //                 .on('receipt', function (receipt) {
      //                     console.log(receipt.transactionHash)
      //             })

      //     })
    });
    // this.RecordUploaderContract.methods.sendHash(result[0].hash,this.state.userAddress).send(
    //   {from:this.state.currentAccount,gas : 4700000,gasPrice:web3.utils.toHex(web3.utils.toWei('100','gwei'))}, function(error, txHash){
    //     alert('Transaction Hash:'+txHash)
    //   })
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Hospital Record Upload
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h2>Hospital</h2>
              <form onSubmit={this.onSubmit}>
                <CardBody>
                  <Row>
                    <Col md="3">
                      <Label>Enter User Aadhaar </Label>
                    </Col>
                    <Col md="4">
                      <input
                        type="number"
                        name="aadhaar"
                        value={this.state.aadhaar}
                        onChange={this.handleInputChange}
                        autoComplete="false"
                        required
                      />
                    </Col>
                  </Row>
                </CardBody>
                <br />

                <CardBody>
                  <Row>
                    <Col md="3">
                      <Label>Upload Record</Label>
                    </Col>
                    <br />
                    <Col md="4">
                      <input type="file" onChange={this.captureFile} />
                    </Col>
                  </Row>
                  <br />
                  <br />
                  <Row>
                    <Col md="3">
                      <Label>Enter Name of Record </Label>
                      <br />
                    </Col>
                    <Col md="4">
                      <input
                        type="text"
                        name="rname"
                        value={this.state.rname}
                        onChange={this.handleInputChange}
                        autoComplete="false"
                        required
                      />
                    </Col>
                  </Row>
                </CardBody>

                <br />

                <CardBody>
                  <Row>
                    <Col md="3">
                      <Label>Enter Type of Record </Label>
                    </Col>
                    <Col md="4">
                      <input
                        type="text"
                        name="type"
                        value={this.state.type}
                        onChange={this.handleInputChange}
                        autoComplete="false"
                        required
                      />
                    </Col>
                    <Col md="3">
                      {/* <Label htmlFor="ccmonth">Month</Label> */}
                      <Input type="select" name="type" id="recordType" required>
                        <option value="Routine">Routine</option>
                        <option value="Sensitive">Sensitive</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Claim">Claim</option>
                      </Input>
                    </Col>
                    <br />
                  </Row>
                  <br />
                  <Row>
                    <Col md="4" />

                    <Col md="4">
                      <button color="primary" type="submit">
                        Submit
                      </button>
                    </Col>
                  </Row>
                </CardBody>
              </form>
            </div>
          </div>
        </main>
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <strong>Hospital</strong>
            </CardHeader>
            <CardBody>
              <Form
                action=""
                method="post"
                encType="multipart/form-data"
                className="form-horizontal"
              >
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Enter Aadhaar</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      id="text-input"
                      name="text-input"
                      placeholder="Text"
                    />
                    <FormText color="muted">This is a help text</FormText>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="input">Record Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      id="disabled-input"
                      name="disabled-input"
                      placeholder="Record Name"
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="select">Select</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="select" name="select" id="select">
                      <option value="Routine">Routine</option>
                      <option value="Sensitive">Sensitive</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Claim">Claim</option>
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="file-input">File input</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="file" id="file-input" name="file-input" />
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
            <CardFooter>
              <Button type="submit" size="sm" color="primary">
                <i className="fa fa-dot-circle-o" /> Submit
              </Button>
              <Button type="reset" size="sm" color="danger">
                <i className="fa fa-ban" /> Reset
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
}

export default Dashboard;
