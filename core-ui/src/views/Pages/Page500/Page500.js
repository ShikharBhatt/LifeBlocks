import React, { Component } from "react";
import {
  Button,
  Col,
  Card,
  CardBody,
  Table,
  CardHeader,
  Container,
  Row
} from "reactstrap";
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import Tables from "../../Base/Tables/Tables";
import Cards from "../../Base/Cards/Cards";

class Page500 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //declaring state variables
      web3: null,
      currentAddress: null,
      events: null
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

    const UserDetailsContract = new this.state.web3.eth.Contract(
      ABI,
      contractAddress
    );
    UserDetailsContract.getPastEvents(
      "AllEvents",
      {
        fromBlock: 0,
        toBlock: "latest"
      },
      (err, events) => {
        console.log("---events---");
        console.log("No of events", events.length);
        console.log("custom ", events[1].blockNumber);

        this.setState({ events: events });
        console.log("events in 500", this.state.events);
      }
    );
  }
  createTable = () => {
    let table = [];
    let ids = [];

    // Outer loop to create parent
    // for (let i = 0; i < 3; i++) {

    // children.map(
    //   chk => {
    //     return (<tr>
    //       <td>chk.id</td>
    //       <td>chk.col1</td>
    //       <td>chk.col2</td>
    //       <td>chk.col3</td>
    // <td>
    //   <input type="checkbox"
    //     // defaultChecked={this.state.chkbox}
    //     onChange={console.log("checkbox")} />
    // </td>
    //     </tr>);
    //   },
    for (let i = 0; i < this.state.events.length; i++) {
      table.push(
        <tr key={i}>
          <td>{this.state.events[i].blockNumber}</td>
          {/* <td>{this.state.events[i].returnValues[0]}</td> */}
          <td>
            {this.state.events[i].event} &nbsp; (
            {this.state.events[i].returnValues[0]}&nbsp; ==>&nbsp;
            {this.state.events[i].returnValues[1]})
          </td>
          <td>{this.state.events[i].type}</td>
          {/* <td>{}</td> */}
        </tr>
      );
    }
    return table;
  };
  render() {
    if (this.state.events === null) return <div />;
    else {
      return (
        <div className="animated fadeIn container">
          {/* <Cards events={this.state.events} /> */}
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> Striped Table
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>blockNumber</th>
                      <th>event</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>{this.createTable()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </div>
      );
    }
  }
}

export default Page500;
