import React, { Component } from "react";
import { Button, Card, Collapse, Fade, CardBody, CardColumns, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter } from "reactstrap";
import getWeb3 from "../../Dependencies/utils/getWeb3";
import $ from "jquery";
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.blocks = [];
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      web3: null,
      bloc: []
    };
  }

  convertTimestamp = time => {
    var d = new Date(time * 1000), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
      dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
      ampm = "AM",
      time;
    if (hh > 12) {
      h = hh - 12;
      ampm = "PM";
    } else if (hh === 12) {
      h = 12;
      ampm = "PM";
    } else if (hh === 0) {
      h = 12;
    }
    // ie: 2014-03-24, 3:00 PM
    var time1 = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;
    return time1;
  };


  componentDidMount() {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ blockNumber: 0 });
  }
  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.blockNumber);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
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
    //await this.instantiateContract();

  }
  timer = () => {
    this.state.web3.eth.getBlockNumber().then(latestBlock => {
      console.log(latestBlock);
      if (this.state.blockNumber !== latestBlock) {
        // List blocks in table
        for (var i = this.state.blockNumber + 1; i <= latestBlock; i++) {
          this.state.web3.eth.getBlock(i).then(block => {
            var number = block.number;
            var hash = block.transactions[0];
            var time = block.timestamp;
            var gas = block.gasUsed;
            var time = this.convertTimestamp(block.timestamp);
            console.log("time=", time);
            this.state.web3.eth.getTransaction(hash).then(sender => {
              console.log(sender.from);
              $("tbody").append(
                "<tr><td>" +
                sender.from +
                "<br>" +
                sender.to +
                "</td><td>" +
                number +
                "</td><td>" +
                time +
                "</td><td>" +
                hash +
                "</tr>"
              );
              // $(".display").append(
              console.log("bacl")
              this.blocks.push(
                <Card>
                  <CardHeader>
                    {sender.from}
                    <div className="card-header-actions">
                      {/* eslint-disable-next-line */}
                      {/* <a href="#" className="card-header-action btn btn-setting"><i className="icon-settings"></i></a> */}
                      {/*eslint-disable-next-line*/}
                      <a className="card-header-action btn btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></a>
                      {/*eslint-disable-next-line*/}
                    </div>
                  </CardHeader>
                  <Collapse isOpen={this.state.collapse} id="collapseExample">
                    <CardBody>
                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                      laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                      ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                  </CardBody>
                  </Collapse>
                </Card >
              )
              this.setState({ bloc: this.blocks })
              // );
            });
          });
        }
        this.setState({ blockNumber: latestBlock });
      }
    });
  };
  // async instantiateContract() {


  //   //Initialize user details contract
  //   const userContractAddress = userdetails.contract_address;
  //   const userABI = userdetails.abi;
  //   var userContract = new this.state.web3.eth.Contract(userABI, userContractAddress);
  //   this.userContract = userContract;
  //   //Initialize storage contract
  //   const storageContractAddress = storage.contract_address;
  //   const storageABI = storage.abi;
  //   var storageContract = new this.state.web3.eth.Contract(storageABI, storageContractAddress);
  //   this.storageContract = storageContract;
  //   //Organizaton
  //   const orgContractAddress = organization.contract_address
  //   const orgABI = organization.abi
  //   var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
  //   this.orgContract = orgContract
  //   //Initialize Policy contract
  //   const policyContractAddress = policy.contract_address;
  //   const policyABI = policy.abi;
  //   var policyContract = new this.state.web3.eth.Contract(policyABI, policyContractAddress);
  //   this.policyContract = policyContract;
  //   //PolicyTemplate Contract Instantitation
  //   const templateABI = policyTemplate.abi

  //   await this.state.web3.eth.getAccounts((error, accounts) => {
  //     if (!error) {
  //       console.log(accounts[0])
  //       this.setState({
  //         account: accounts[0]
  //       })
  //       if (sessionStorage.getItem("orgType") == "Insurance") { }
  //       else {
  //         console.log("hospital  logged in")
  //         this.orgContract.methods.getOrgDetails(accounts[0]).call(
  //           { from: accounts[0] }, (error, details) => {
  //             if (!error) {
  //               if (details[2] === sessionStorage.getItem("orgId")) {
  //                 this.orgContract.methods.getOrgRecords(accounts[0]).call(
  //                   { from: this.state.account }, (error, recordIDs) => {
  //                     if (!error) {
  //                     }
  //                   })
  //               }
  //               else {
  //                 alert("Incorrect Details! Please re-check the account in your metamask")
  //               }
  //             }
  //           })
  //       }
  //     }
  //     else {
  //       console.log(error)
  //     }
  //   })

  // }


  render() {
    return (
      <div className="App">
        <div className="animated fadeIn">
          <Row className="justify-content-center">
            <Col xs="12" sm="6" md="12">
              <Card>
                <CardHeader>
                  Card actions
                  <div className="card-header-actions">
                    {/* eslint-disable-next-line */}
                    {/* <a href="#" className="card-header-action btn btn-setting"><i className="icon-settings"></i></a> */}
                    {/*eslint-disable-next-line*/}
                    <a className="card-header-action btn btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></a>
                    {/*eslint-disable-next-line*/}
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                    ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
          </Row>
          <Row>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">From/To Addresses</th>
                  <th scope="col">Block</th>
                  <th scope="col">Timestamp</th>
                  <th scope="col">TxHash</th>
                </tr>
              </thead>
              <tbody />
            </table>
          </Row>
          <div className="display"></div>
          {this.state.bloc}
        </div>
      </div>
    );

  }
}


export default Dashboard;
