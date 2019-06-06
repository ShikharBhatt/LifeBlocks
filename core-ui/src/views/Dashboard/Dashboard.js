import React, { Component, lazy, Suspense } from 'react';
import { Link, BrowserRouter, Route, Redirect } from "react-router-dom";
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import getWeb3 from "../../Dependencies/utils/getWeb3";
import { firebaseApp } from "../../Dependencies/firebase";
import * as firebase from "firebase";
import { userdetails, storage, organization, permissions } from "../../contract_abi";

import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardColumns,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';



class Dashboard extends Component {
  constructor(props) {
    super(props);

    // this.toggle = this.toggle.bind(this);
    // this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    // this.state = {
    //   dropdownOpen: false,
    //   radioSelected: 2,
    // };

    this.state = {
      userAddress: '',
      selectValue: '',
      account: null,
      value: '',
      web3: null,
      insuranceAdds: [],
      insuranceCompanies: [],
      insurancePolicies: [],
      insuranceAddress: null,
      insuranceName: null,
      appliedAddress: '',
      policyDetails: [],
      policyContract: null,
      ar: [],
      number: [],
      fetched: null,
      response: '',
      orgAddress: '',
      contractAddress: '',
      responseToPost: '',
      userInfo: null,
      count:0
    };

    this.records = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    //this.insurancePopulate = this.insurancePopulate.bind(this);
    //this.showPolicies = this.showPolicies.bind(this);
    //this.getPolicyTemplates = this.getPolicyTemplates.bind(this);

  }

  async componentWillMount() {


    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    await getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
      })
      .catch(() => {
        console.log('Error finding web3.')

      })

    await this.instantiateContract()
    await this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
    console.log("Response from API : ", this.state.response)
  }


  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();
    await this.setState({
      orgAddress: "0xB77A7aEc62ABE912A87cc27966806e846C7A126F",
      contractAddress: "0x17AEBEc803b1Ee1BB693cB6A9391a07CD234512F  "
    })
    const response = await fetch('/api/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgAddress: this.state.orgAddress, contractAddress: this.state.contractAddress }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
    console.log("Response from API : ", this.state.responseToPost)
  };

  async instantiateContract() {

    //User Details Contract Instantiation
    const contractAddress_u = userdetails.contract_address
    const ABI_u = userdetails.abi
    var UserContract = new this.state.web3.eth.Contract(ABI_u, contractAddress_u)
    this.UserContract = UserContract

    //Organisation Contract Instantitation
    const contractAddress = storage.contract_address
    const ABI = storage.abi
    var storageContract = new this.state.web3.eth.Contract(ABI, contractAddress)
    this.storageContract = storageContract

    console.log("User Contract: " + this.UserContract)

    //Get account from metamask
    await this.state.web3.eth.getAccounts((error, account) => {
      if (!error) {
        console.log(account[0])
      }

      //get aadhaar value stored in Session
      let aadhaar = sessionStorage.getItem('aadhaar')
      let address = account[0]
      // alert(aadhaar)

      firebaseApp
      .database()
      .ref("/uidai/")
      .orderByChild("aadhaar_no")
      .equalTo(aadhaar)
      .once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(child) {
          this.setState({
            userInfo: child.val(),
            count:1
          })
          console.log(child.val())
        }.bind(this));
      }.bind(this));

      this.storageContract.methods.reportDate(aadhaar).call(
        { from: account[0] }, function (error, xb) {

          console.log(xb)
          alert(aadhaar)
          //if there are no records for the user
          if (xb === null) {
            alert("No records found for Report Date")
          }

          //if record length is greater than 0
          else if (xb.length != 0) {
            let rid = []

            //convert the record string array to number array
            for (let j = 0; j < xb.length; j++) {
              rid[j] = Number(xb[j])
            }

            for (let j = 0; j < xb.length; j++) {
              xb[j] = rid[j]
            }

            this.setState({ number: xb.length })
            let l = 0
            // console.log("Oh this ", x);
            for (let kb = 0; kb < xb.length; kb++) {
              let vb = new Date(Number(xb[kb]) * 1000).toLocaleDateString()
              let number = Number(vb[3]) * 10 + Number(vb[4])
              console.log("this is ", vb, " month ", number)
              l++
              this.records[number - 1]++;
              this.setState({ ar: this.records, fetched: l })
              console.log("array inc", this.state.ar[number])

              console.log(this.state.ar)

            }

          }
          else {
            alert("No records found for Report Date")
          }


        }.bind(this))
    })
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    let newarr = this.state.ar;
    if (sessionStorage.getItem("aadhaar") === null)
      //return (window.location.href = "/dashboard");
      this.props.history.push("/login");

    if ((this.state.fetched !== this.state.number) || (this.state.count===0) ) {
      return (
        <div>Loading...</div>
      );
    }
    else {
      return (
        <div className="animated fadeIn">
      <Row>
          <Col md="9" lg="12" xl="12">
        <Card>
       
          <CardHeader>
            <strong>Your Information<b id="policy" > </b></strong>
          </CardHeader>
          <CardBody>
          <Table responsive striped>
          <tbody>
            <tr>
              <td><strong>Aadhaar Number</strong></td>
              <td>{this.state.userInfo.aadhaar}</td>
            </tr>
            <tr>
                <td><strong>Name</strong></td>
                <td>{this.state.userInfo.name}</td>
            </tr>
            <tr>
                <td><strong>Phone Number</strong></td>
                <td>{this.state.userInfo.phone}</td>
            </tr>
            <tr>
              <td><strong>Correspondence Address</strong></td>
              <td>{this.state.userInfo.address}</td>
            </tr>
            <tr>
                <td><strong>Date of birth</strong></td>
                <td>{this.state.userInfo.dob}</td>
            </tr>
            <tr>
                <td><strong>Gender</strong></td>
                <td>{this.state.userInfo.gender}</td>
            </tr>
            <tr>
                <td><strong>Email id</strong></td>
                <td>{this.state.userInfo.email}</td>
            </tr>
            <tr>
                <td><strong>Father's Name</strong></td>
                <td>{this.state.userInfo.fathers_name}</td>
            </tr>
          </tbody>

          </Table>
         
          </CardBody>         
        </Card>
        </Col>
        </Row>
        <Row>
          <h3>Statistics</h3>        
          </Row>
          <Row>
          <Col md="6" lg="9" xl="9">
            <Card>
              <CardHeader>
                Number of Hospital Visits per Month
              <div className="card-header-actions" />
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={
                    {
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,99,132,0.2)',
                          borderColor: 'rgba(255,99,132,1)',
                          borderWidth: 1,
                          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                          hoverBorderColor: 'rgba(255,99,132,1)',
                          data: this.state.ar,
                        },
                      ],
                    }
                  } options={{
                    tooltips: {
                      enabled: false,
                      custom: CustomTooltips
                    }, maintainAspectRatio: false
                  }} />
                </div>
                <Button onClick={this.handleSubmit}>Submit</Button>
              </CardBody>
            </Card>
          </Col>
          </Row>
        </div>
      );

    }

  }
}

export default Dashboard;
