import React, { Component } from "react";
import { Button, Card, CardBody, CardColumns, CardHeader, Col, Row, Input, FormText, Label, FormGroup, Form, CardFooter } from "reactstrap";
import ipfs from "../../Dependencies/ipfs";
import { encrypt } from "../../Dependencies/crypto";
import { getKeys, keyEncrypt } from "../../Dependencies/pgp";
import { userdetails, storage, policy, organization, policyTemplate } from "../../contract_abi";
import getWeb3 from "../../Dependencies/utils/getWeb3";
import { Bar, Doughnut } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

//prints on console what type of organization is logged in - hospital or insurance company
console.log("Type:", sessionStorage.getItem("orgType"));

class Dashboard extends Component {
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
      ar: [],
      x: [],
      policiesNo: null,
      f: null,
      diffPolicyTemp: [],
      countdiffPolicy: [],
      countdiffPrem: [],
      policyNames: [],
      policyRatioReport: [],
      recordUploadPerMonth: [],
      noPPM: [],
      mM: [],
      nForRisk: [],
      stateMap: { 0: 'AppliedWOR', 1: 'Applied', 2: 'AppliedSP', 3: 'Active', 4: 'Grace', 5: 'Lapsed', 6: 'RenewalWOR', 7: 'Renewal', 8: 'Inactive', 9: 'Defunct', 10: 'NA' },
    };

    this.status = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.pN = []
    this.minMax = []
    this.pRR = [0, 0, 0]
    this.noOfPoliciesPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.namesforRisk = []
    this.rUPM = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    //Organizaton
    const orgContractAddress = organization.contract_address
    const orgABI = organization.abi
    var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
    this.orgContract = orgContract
    //Initialize Policy contract
    const policyContractAddress = policy.contract_address;
    const policyABI = policy.abi;
    var policyContract = new this.state.web3.eth.Contract(policyABI, policyContractAddress);
    this.policyContract = policyContract;
    //PolicyTemplate Contract Instantitation
    const templateABI = policyTemplate.abi

    const weiToEther = 1000000000000000000

    await this.state.web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        console.log(accounts[0])
        this.setState({
          account: accounts[0]
        })
        if (sessionStorage.getItem("orgType") == "Insurance") {
          console.log("insurance company logged in")
          this.orgContract.methods.getOrgDetails(accounts[0]).call(
            { from: accounts[0] }, (error, details) => {
              if (!error) {
                console.log("Fetched org ID:", details[2])
                if (details[2] === sessionStorage.getItem("orgId")) {
                  this.orgContract.methods.returnAllPolicy(accounts[0]).call(
                    { from: this.state.account }, (error, policies) => {
                      if (!error) {
                        console.log("policies :", policies);
                        this.setState({
                          insurancePolicies: policies
                        })
                        this.state.diffPolicyTemp.push(details.length)
                        //console.log("this is diff policy", this.state.diffPolicyTemp)

                        const templateABI = policyTemplate.abi
                        let myarray = []
                        let m = 0
                        let z = 0
                        let premiumCount = []


                        for (let i = 0; i < policies.length; i++) {     //all templates 
                          let obj = {}
                          let min = 1000000000000000000000000000000
                          let max = 0
                          premiumCount.push(0);
                          this.minMax.push(0);
                          this.minMax.push(0);
                          console.log("refreshing")
                          var templateContractAddress = policies[i]
                          var templateContract = new this.state.web3.eth.Contract(templateABI, templateContractAddress)

                          templateContract.methods.getPolicies().call(
                            { from: accounts[0] }, (error, details) => {
                              if (!error) {
                                m = m + details.length
                                //m = m + details.length
                                this.state.countdiffPolicy.push(details.length)
                                //console.log("this is diff policy count", this.state.countdiffPolicy)
                                //console.log(details)
                                let prem = 0
                                min = 1000000000000000000000000000000
                                max = 0
                                for (let t = 0; t < details.length; t++) {    //for each policy in template
                                  //console.log(details.getState())

                                  var det = new this.state.web3.eth.Contract(policy.abi, details[t])
                                  det.methods.getState().call({ from: accounts[0] }, (err, state) => {
                                    if (!error) {
                                      z++
                                      this.status[Number(state)]++
                                      if (Number(state) === 3) this.pRR[1]++
                                      else if (Number(state) === 9) this.pRR[2]++
                                      else this.pRR[0]++
                                      //console.log("pRR array", state, this.pRR)
                                      //console.log("status array", this.status)
                                      this.setState({
                                        x: this.status,
                                        f: z,
                                        policiesNo: m,
                                        policyRatioReport: this.pRR
                                      })
                                    }
                                  })

                                  var toEther
                                  det.methods.getPremium().call({ from: accounts[0] }, (error, premium) => {
                                    if (!error) {

                                      toEther = (Number(premium))/weiToEther

                                      premiumCount[i] += toEther
                                      //console.log("premium :", premiumCount)

                                      
                                      if (toEther < Number(min)) {
                                        min = toEther
                                        this.minMax[2 * i] = min
                                      }
                                      else {
                                        console.log(" this for min -->", premium, "<", min)
                                      }
                                      if (toEther > Number(max)) {
                                        max = toEther
                                        this.minMax[2 * i + 1] = max
                                      }
                                      else {
                                        console.log(" this for max-->", premium, ">", max)
                                      }
                                      console.log(" hello ", this.minMax)

                                      this.setState({
                                        countdiffPrem: premiumCount,
                                        mM: this.minMax
                                      })
                                    }
                                  })

                                  det.methods.getDetails().call({ from: accounts[0] }, (err, policyDetails) => {
                                    if (!error) {
                                      let date = new Date(Number(policyDetails[5]) * 1000).toLocaleDateString()
                                      //console.log(" date ", date)
                                      let number = Number(date[3]) * 10 + Number(date[4])
                                      //console.log("this is ", date, " month ", number)
                                      this.noOfPoliciesPerMonth[Number(number) - 1]++;
                                      //console.log("noPPM ", this.noOfPoliciesPerMonth)
                                      this.setState({
                                        noPPM: this.noOfPoliciesPerMonth
                                      })
                                    }
                                  })
                                }
                                console.log("min max", min, max)
                              }
                            }
                          )

                          templateContract.methods.getPolicyDetails().call(
                            { from: accounts[0] }, (error, res) => {
                              if (!error) {

                                this.pN.push(res[1])
                                this.namesforRisk.push(res[1] + "(min)")
                                this.namesforRisk.push(res[1] + "(max)")
                                //console.log("PN", this.pN)
                                this.setState({
                                  policyNames: this.pN,
                                  nForRisk: this.namesforRisk
                                })
                                //console.log("res for name", this.state.policyNames)
                              }
                            }
                          )

                        }

                      }
                    })

                }
                else {
                  alert("Incorrect Details! Please re-check the account in your metamask")
                }
              }
            })
        }
        else {
          console.log("hospital  logged in")
          this.orgContract.methods.getOrgDetails(accounts[0]).call(
            { from: accounts[0] }, (error, details) => {
              if (!error) {
                console.log("Fetched org ID:", details[2])
                if (details[2] === sessionStorage.getItem("orgId")) {
                  this.orgContract.methods.getOrgRecords(accounts[0]).call(
                    { from: this.state.account }, (error, recordIDs) => {
                      if (!error) {
                        console.log("record IDs : ", recordIDs);
                        this.setState({
                        })

                        for (let kk = 0; kk < recordIDs.length; kk++) {
                          this.storageContract.methods.viewRecord(Number(recordIDs[kk])).call({
                            from: accounts[0]
                          }, (error, recDetails) => {
                            let date = new Date(Number(recDetails[3]) * 1000).toLocaleDateString()
                            console.log(" date ", date)
                            let number = Number(date[3]) * 10 + Number(date[4])
                            this.rUPM[number - 1]++
                            console.log(" rupm ", this.rUPM)
                            this.setState({
                              recordUploadPerMonth: this.rUPM
                            })
                          })
                        }
                        //console.log("this is diff policy", this.state.diffPolicyTemp)

                        // const templateABI = policyTemplate.abi
                        // let myarray = []
                        // let m = 0
                        // let z = 0
                        // let premiumCount = []

                        // for (let i = 0; i < policies.length; i++) {
                        //   let obj = {}
                        //   premiumCount.push(0);
                        //   var templateContractAddress = policies[i]
                        //   var templateContract = new this.state.web3.eth.Contract(templateABI, templateContractAddress)

                        //   templateContract.methods.getPolicies().call(
                        //     { from: accounts[0] }, (error, details) => {
                        //       if (!error) {
                        //         m = m + details.length
                        //         //m = m + details.length
                        //         this.state.countdiffPolicy.push(details.length)
                        //         //console.log("this is diff policy count", this.state.countdiffPolicy)
                        //         //console.log(details)
                        //         let prem = 0
                        //         for (let t = 0; t < details.length; t++) {
                        //           //console.log(details.getState())

                        //           var det = new this.state.web3.eth.Contract(policy.abi, details[t])
                        //           det.methods.getState().call({ from: accounts[0] }, (err, state) => {
                        //             if (!error) {
                        //               z++
                        //               this.status[Number(state)]++
                        //               if (Number(state) === 3) this.pRR[1]++
                        //               else if (Number(state) === 9) this.pRR[2]++
                        //               else this.pRR[0]++
                        //               //console.log("pRR array", state, this.pRR)
                        //               //console.log("status array", this.status)
                        //               this.setState({
                        //                 x: this.status,
                        //                 f: z,
                        //                 policiesNo: m,
                        //                 policyRatioReport: this.pRR
                        //               })
                        //             }
                        //           })

                        //           det.methods.getPremium().call({ from: accounts[0] }, (err, premium) => {
                        //             if (!error) {
                        //               premiumCount[i] += Number(premium)
                        //               //console.log("premium :", premiumCount)
                        //               this.setState({
                        //                 countdiffPrem: premiumCount
                        //               })
                        //             }
                        //           })

                        //           det.methods.getDetails().call({ from: accounts[0] }, (err, policyDetails) => {
                        //             if (!error) {
                        //               let date = new Date(Number(policyDetails[5]) * 1000).toLocaleDateString()
                        //               //console.log(" date ", date)
                        //               let number = Number(date[3]) * 10 + Number(date[4])
                        //               //console.log("this is ", date, " month ", number)
                        //               this.noOfPoliciesPerMonth[Number(number) - 1]++;
                        //               //console.log("noPPM ", this.noOfPoliciesPerMonth)
                        //               this.setState({
                        //                 noPPM: this.noOfPoliciesPerMonth
                        //               })
                        //             }
                        //           })
                        //         }
                        //       }
                        //     }
                        //   )

                        //   templateContract.methods.getPolicyDetails().call(
                        //     { from: accounts[0] }, (error, res) => {
                        //       if (!error) {

                        //         this.pN.push(res[1])
                        //         //console.log("PN", this.pN)
                        //         this.setState({
                        //           policyNames: this.pN
                        //         })
                        //         //console.log("res for name", this.state.policyNames)
                        //       }
                        //     }
                        //   )

                        // }

                      }
                    })

                }
                else {
                  alert("Incorrect Details! Please re-check the account in your metamask")
                }
              }
            })

        }

      }
      else {
        console.log(error)
      }

    })

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
    //if insurance company logged in then render this
    if (sessionStorage.getItem("orgType") == "Insurance") {
      this.state.ar = this.status
      if (this.state.f === this.state.policiesNo) {
        return (<div className="animated fadeIn">
          <h3>Reports</h3>
          <br />
          <CardColumns className="cols-2">
            <Card>
              <CardHeader>
                Policies Stats
          <div className="card-header-actions" />
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={
                    {
                      labels: ['AppliedWOR', 'Applied', 'AppliedSP', 'Active', 'Grace', 'Lapsed', 'RenewalWOR', 'Renewal', 'Inactive', 'Defunct'],
                      datasets: [
                        {
                          label: 'Number',
                          backgroundColor: 'rgba(255,99,132,0.2)',
                          borderColor: 'rgba(255,99,132,1)',
                          borderWidth: 1,
                          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                          hoverBorderColor: 'rgba(255,99,132,1)',
                          data: this.state.x,
                        },
                      ],
                    }
                  } options={{
                    scales: {
                      yAxes: [{
                        stacked: false,
                        gridLines: {
                          display: false,
                          color: "rgba(255,99,132,0.2)"
                        },
                        ticks: {
                          min: 0,
                          callback: function (value, index, values) {
                            if (Math.floor(value) === value) {
                              return value;
                            }
                          }
                        }
                      }]
                    },
                    tooltips: {
                      enabled: false,
                      custom: CustomTooltips
                    }, maintainAspectRatio: false
                  }} />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                Per Policy - Buyers
          <div className="card-header-actions" />
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={
                    {
                      labels: this.state.policyNames,
                      datasets: [
                        {
                          label: 'Number',
                          backgroundColor: 'rgba(255,99,132,0.2)',
                          borderColor: 'rgba(255,99,132,1)',
                          borderWidth: 1,
                          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                          hoverBorderColor: 'rgba(255,99,132,1)',
                          data: this.state.countdiffPolicy,
                        },
                      ],
                    }
                  } options={{
                    scales: {
                      yAxes: [{
                        gridLines: {
                          display: false,
                          color: "rgba(255,99,132,0.2)"
                        },
                        ticks: {
                          min: 0,
                          callback: function (value, index, values) {
                            if (Math.floor(value) === value) {
                              return value;
                            }
                          }
                        }
                      }]
                    },
                    tooltips: {
                      enabled: false,
                      custom: CustomTooltips
                    }, maintainAspectRatio: false
                  }} />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                Per Policy - Pool Amount
          <div className="card-header-actions" />
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={
                    {
                      labels: this.state.policyNames,
                      datasets: [
                        {
                          label: 'Amount',
                          backgroundColor: 'rgba(255,99,132,0.2)',
                          borderColor: 'rgba(255,99,132,1)',
                          borderWidth: 1,
                          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                          hoverBorderColor: 'rgba(255,99,132,1)',
                          data: this.state.countdiffPrem,
                        },
                      ],
                    }
                  } options={{
                    scales: {
                      yAxes: [{
                        stacked: false,
                        gridLines: {
                          display: false,
                          color: "rgba(255,99,132,0.2)"
                        },
                        ticks: {
                          min: 0,
                          callback: function (value, index, values) {
                            if (Math.floor(value) === value) {
                              return value;
                            }
                          }
                        }
                      }]
                    },
                    tooltips: {
                      enabled: false,
                      custom: CustomTooltips
                    }, maintainAspectRatio: false
                  }} />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                Policy Ratio Report
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Doughnut data={
                    {
                      labels: [
                        'Pending',
                        'Active',
                        'Defunct',
                      ],
                      datasets: [
                        {
                          data: this.state.policyRatioReport,
                          backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                          ],
                          hoverBackgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                          ],
                        }],
                    }
                  } />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                no of transactions
          <div className="card-header-actions" />
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={
                    {
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                      datasets: [
                        {
                          label: 'Number',
                          backgroundColor: 'rgba(255,99,132,0.2)',
                          borderColor: 'rgba(255,99,132,1)',
                          borderWidth: 1,
                          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                          hoverBorderColor: 'rgba(255,99,132,1)',
                          data: this.state.noPPM,
                        },
                      ],
                    }
                  } options={{
                    scales: {
                      yAxes: [{
                        stacked: false,
                        gridLines: {
                          display: false,
                          color: "rgba(255,99,132,0.2)"
                        },
                        ticks: {
                          min: 0,
                          callback: function (value, index, values) {
                            if (Math.floor(value) === value) {
                              return value;
                            }
                          }
                        }
                      }]
                    },
                    tooltips: {
                      enabled: false,
                      custom: CustomTooltips
                    }, maintainAspectRatio: false
                  }} />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                Risk Factor
          <div className="card-header-actions" />
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={
                    {
                      labels: this.state.nForRisk,
                      datasets: [
                        {
                          label: 'Number',
                          backgroundColor: 'rgba(255,99,132,0.2)',
                          borderColor: 'rgba(255,99,132,1)',
                          borderWidth: 1,
                          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                          hoverBorderColor: 'rgba(255,99,132,1)',
                          data: this.state.mM,
                        },
                      ],
                    }
                  } options={{
                    scales: {
                      yAxes: [{
                        gridLines: {
                          display: false,
                          color: "rgba(255,99,132,0.2)"
                        },
                        ticks: {
                          min: 0,
                          callback: function (value, index, values) {
                            if (Math.floor(value) === value) {
                              return value;
                            }
                          }
                        }
                      }]
                    },
                    tooltips: {
                      enabled: false,
                      custom: CustomTooltips
                    }, maintainAspectRatio: false
                  }} />
                </div>
              </CardBody>
            </Card>
          </CardColumns>
        </div>);

      }
      else {
        return <div></div>
      }
      // return <div className="App"> This is Insurance Page</div>;
    }

    //if hospital logged in then render this
    else {
      console.log(localStorage.hosp)
      if (!localStorage.hosp) {
        localStorage.setItem("hosp", "true");
        window.location.reload();
      }

      return (
        <div className="App">
          <div className="animated fadeIn">
            <Row className="justify-content-center">
              <Col md="9" lg="7" xl="6">
                <Card>
                  <CardHeader>
                    No. of Records Uploaded
          <div className="card-header-actions" />
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Bar data={
                        {
                          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                          datasets: [
                            {
                              label: 'Number',
                              backgroundColor: 'rgba(255,99,132,0.2)',
                              borderColor: 'rgba(255,99,132,1)',
                              borderWidth: 1,
                              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                              hoverBorderColor: 'rgba(255,99,132,1)',
                              data: this.state.recordUploadPerMonth,
                            },
                          ],
                        }
                      } options={{
                        scales: {
                          yAxes: [{
                            gridLines: {
                              display: false,
                              color: "rgba(255,99,132,0.2)"
                            },
                            ticks: {
                              min: 0,
                              callback: function (value, index, values) {
                                if (Math.floor(value) === value) {
                                  return value;
                                }
                              }
                            }
                          }]
                        },
                        tooltips: {
                          enabled: false,
                          custom: CustomTooltips
                        }, maintainAspectRatio: false
                      }} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      );

    }
  }
}

export default Dashboard;
