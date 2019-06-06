import React, { Component } from "react";
import { Button, Card, Collapse, Fade, CardBody, CardColumns, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter } from "reactstrap";
import getWeb3 from "../../Dependencies/utils/getWeb3";
import $ from "jquery";
import "../../index.css"
import { userdetails, storage, organization, permissions, policy, policyTemplate } from "../../contract_abi";
const abiDecoder = require('abi-decoder'); // NodeJS

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.syntaxHighlight = this.syntaxHighlight.bind(this);
    this.blocks = [];
    this.state = {
      collapse: [],
      collap: [],
      fadeIn: true,
      timeout: 300,
      web3: null,
      bloc: [],
      mapToggle: [],
      col: false,
      blockNumber: 0,
    };
    this.tog = [];
    this.mapT = [];
    this.num = 0;
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
    var time1 = dd + "-" + mm + "-" + yyyy + ", " + h + ":" + min + " " + ampm;
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

  toggle = l => {
    const newCounters = [...this.state.collap];
    //const index = this.state.counters.indexOf(counter);
    //newCounters[index].value = false;
    this.setState({ collap: newCounters });

    console.log("console l = ", l, " tog[", l, "]", this.tog[l])
    const newtog = [...this.tog]
    newtog[l] = !this.tog[l]
    this.setState({ collapse: newtog });
    console.log("toggle pressed ", this.tog)
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  async componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    const userABI = userdetails.abi
    const orgABI = organization.abi
    const storageABI = storage.abi
    const policyABI = policy.abi;
    const templateABI = policyTemplate.abi
    const permissionABI = permissions.abi

    abiDecoder.addABI(userABI);
    abiDecoder.addABI(orgABI);
    abiDecoder.addABI(storageABI);
    abiDecoder.addABI(policyABI);
    abiDecoder.addABI(templateABI);
    abiDecoder.addABI(permissionABI);

    await getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });
        console.log("desp", results.web3.utils.hexToAscii('0x608060405234801561001057600080fd5b50610ebc806100206000396000f3006080604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631358ba44146100a957806338245f99146100f65780633dbfd97c14610163578063598ee2c2146101a857806378bf1b2a146102155780638cad7d1b14610288578063b93f9b0a146102df578063d48851601461034c578063e789af48146103b9578063fa22936e14610475575b600080fd5b3480156100b557600080fd5b506100f460048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061051b565b005b34801561010257600080fd5b5061012160048036038101908080359060200190929190505050610571565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561016f57600080fd5b5061018e600480360381019080803590602001909291905050506105a4565b604051808215151515815260200191505060405180910390f35b3480156101b457600080fd5b506101d3600480360381019080803590602001909291905050506106e4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561022157600080fd5b5061028660048036038101908080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610717565b005b34801561029457600080fd5b506102c9600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b97565b6040518082815260200191505060405180910390f35b3480156102eb57600080fd5b5061030a60048036038101908080359060200190929190505050610baf565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561035857600080fd5b5061037760048036038101908080359060200190929190505050610beb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103c557600080fd5b506103fa600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c28565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561043a57808201518184015260208101905061041f565b50505050905090810190601f1680156104675780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561048157600080fd5b506104a060048036038101908080359060200190929190505050610cd8565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104e05780820151818401526020810190506104c5565b50505050905090810190601f16801561050d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b806003600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60036020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008073ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415151561067c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f4163636f756e7420646f6573206e6f742065786973740000000000000000000081525060200191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16149050919050565b60006020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600073ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156107ed576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f416164686172204361726420616c72656164792065786973747300000000000081525060200191505060405180910390fd5b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415156108a4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f4164647265737320616c7265616479207573656400000000000000000000000081525060200191505060405180910390fd5b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080546001816001161561010002031660029004905014151561096f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4b6579207061697220666f72207573657220616c72656164792065786973747381525060200191505060405180910390fd5b3360008084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507f8df1703981ec5eb9a5ed6a84742794cefdb8cea9703299b3f56e5314a13501163383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a180600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209080519060200190610ac2929190610deb565b507f11b75c77887611dade722ce3543f16551fb4d4ad3a2916642b7e7c8fad9a7fa33382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610b58578082015181840152602081019050610b3d565b50505050905090810190601f168015610b855780820380516001836020036101000a031916815260200191505b50935050505060405180910390a15050565b60016020528060005260406000206000915090505481565b600080600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006003600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60026020528060005260406000206000915090508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610cd05780601f10610ca557610100808354040283529160200191610cd0565b820191906000526020600020905b815481529060010190602001808311610cb357829003601f168201915b505050505081565b60606002600080600085815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ddf5780601f10610db457610100808354040283529160200191610ddf565b820191906000526020600020905b815481529060010190602001808311610dc257829003601f168201915b50505050509050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610e2c57805160ff1916838001178555610e5a565b82800160010185558215610e5a579182015b82811115610e59578251825591602001919060010190610e3e565b5b509050610e679190610e6b565b5090565b610e8d91905b80821115610e89576000816000905550600101610e71565b5090565b905600a165627a7a723058202845f0aa12dbab5628d9cdcd658363a1fc2750c95cadc23901dc7afe6754e8a30029'));
      })
      .catch((results) => {
        console.log("Error finding web3. ERROR ", results);
        // console.log(results.web3.utils.hexToAscii('0x4920686176652031303021'));
      });
    // Instantiate contract once web3 provided.
    //await this.instantiateContract();

  }

  timer = () => {
    this.state.web3.eth.getBlockNumber().then(latestBlock => {
      console.log("--->", latestBlock, " ", this.state.bloc.length, " ", this.state.blockNumber);
      if (this.state.blockNumber !== latestBlock) {
        // List blocks in table
        for (var i = this.state.blockNumber + 1; i <= latestBlock; i++) {
          this.state.web3.eth.getBlock(i).then(block => {
            var number = block.number;
            var hash = block.transactions[0];
            console.log(block.transactions) 
            var time = block.timestamp;
            var gas = block.gasUsed;
            var time = this.convertTimestamp(block.timestamp);
            //console.log("time=", time);
            this.state.web3.eth.getTransaction(hash).then(sender => {

              //console.log(this.state.web3.utils.hexToUtf8(sender.input))
              const decodedData = abiDecoder.decodeMethod(sender.input);
              console.log(JSON.stringify(decodedData, undefined, 4))
              //var sr = JSON.stringify(decodedData, undefined, 5);
              // console.log((sr) => { console.log(this.syntaxHighlight(sr)) })
              // console.log("sender : ", sender);
              // $("#newname").append(
              //   <div>hllo</div>
              // );
              // $(".display").append(

              //  console.log("bacl")
              this.num = number;
              console.log("bacl")
              this.mapT.push({ id: number, value: true })
              this.tog.push(true)
              this.setState({ collapse: this.tog, collap: this.mapT })
              this.blocks.unshift(
                <Card key={number}>
                  <CardHeader>
                    <Row>
                      <Col><pre><strong className="number">Block Number:</strong> {number}</pre> </Col>
                      <Col><pre><strong className="null">Block Hash:</strong> {hash}</pre></Col>
                      <Col><pre><strong className="key">Time: </strong>{time}</pre></Col>
                      <pre>{this.tog[number]}</pre>
                    </Row>
                    <Row>
                      <Col><pre><strong className="string">Sender Address: </strong> {sender.from}</pre></Col>
                      <Col><pre><strong className="boolean">Value: </strong>{sender.value / 1000000000000000000} <strong>ethers</strong></pre></Col>
                      <Col><pre><strong className="string">Receiver Address: </strong> {sender.to}</pre></Col>
                    </Row>
                    <div className="card-header-actions">
                      {/* eslint-disable-next-line */}
                      {/* <a href="#" className="card-header-action btn btn-setting"><i className="icon-settings"></i></a> */}
                      {/*eslint-disable-next-line*/}
                      <a className="card-header-action btn btn-minimize" data-target="#collapseExample"
                        onClick={(number) => {
                          console.log("toggle depressed ", this.tog)
                          // this.tog[number] = !this.tog[number]
                          // this.setState({ collapse: this.tog });

                          //const newCounters = [...this.state.collap];
                          //const index = this.state.counters.indexOf(counter);
                          //newCounters[index].value = false;
                          //this.setState({ collap: newCounters });

                          console.log("console l = ", number, " tog[", number, "]", this.tog[number])
                          const newtog = [...this.tog]
                          newtog[number] = !this.tog[number]
                          this.setState({ collapse: newtog });
                          console.log("collapse after ", this.tog)

                        }}>
                        <i className="icon-arrow-up"></i></a>
                      {/*eslint-disable-next-line*/}
                    </div>
                  </CardHeader>
                  <Collapse isOpen={/*this.state.collapse[number]*/true} id="collapseExample{number}">
                    <CardBody>
                      <pre>{JSON.stringify(decodedData, undefined, 2)}</pre>
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
          {/* <Row className="justify-content-center">
            <Col xs="12" sm="6" md="12">
              <Card>
                <CardHeader>
                  Card actions
                  <div className="card-header-actions">
                    <a className="card-header-action btn btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></a>
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
          </Row> */}
          {/* <Row>
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
          </Row> */}

          <div className="display">

            {this.state.bloc}

          </div>
          <div>
            {console.log("this is impor", this.state.collapse.length, this.tog.length)}
            {console.log("IMPORTANT", this.state.collap)}
          </div>

        </div>
      </div>

    );

  }
}


export default Dashboard;
