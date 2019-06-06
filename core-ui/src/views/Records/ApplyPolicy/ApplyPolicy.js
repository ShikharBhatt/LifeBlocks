import React, { Component } from 'react'
import getWeb3 from "../../../Dependencies/utils/getWeb3";
import SharePolicy from "./SharePolicy"
import { userdetails, organization, policyTemplate } from "../../../contract_abi";
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
  Table
} from "reactstrap";


export class ApplyPolicy extends Component {
  constructor(props) {
    super(props)

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
    };

    this.insurancePopulate = this.insurancePopulate.bind(this);
    this.showPolicies = this.showPolicies.bind(this);
    this.getPolicyTemplates = this.getPolicyTemplates.bind(this);
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


  }


  async instantiateContract() {

    //User Details Contract Instantiation
    const contractAddress_u = userdetails.contract_address
    const ABI_u = userdetails.abi
    var UserContract = new this.state.web3.eth.Contract(ABI_u, contractAddress_u)
    this.UserContract = UserContract

    //Organization Contract Instantitation
    const orgContractAddress = organization.contract_address
    const orgABI = organization.abi
    var orgContract = new this.state.web3.eth.Contract(orgABI, orgContractAddress)
    this.orgContract = orgContract

    //Get account from metamask
    await this.state.web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        console.log(accounts[0])
        this.setState({
          account: accounts[0]
        })
        this.orgContract.methods.retrieveType("Insurance").call({
          from: accounts[0]
        }, (error, x) => {
          console.log(x)
          this.setState({
            insuranceAdds: x
          })

          let insurance = []

          for (let i = 0; i < x.length; i++) {
            this.orgContract.methods.getOrgName(x[i]).call(
              { from: accounts[0] }, (error, y) => {
                let obj = {}
                obj['address'] = x[i]
                obj['name'] = y

                insurance.push(obj)

                this.setState({
                  insuranceCompanies: insurance
                })
              }
            )
          }
        }
        )
      }
      else {
        console.log(error)
      }

    })
  }

  //populate the insurance companies drop down menu
  insurancePopulate(insuranceAdds) {

    const rows = insuranceAdds.map((row, index) => {
      return (
        <option key={index} value={row}>
          {this.state.insuranceCompanies[index].name}
        </option>
      );

    });

    //return the table of records
    return rows
  }


  //fetch the policy templates based on the insurance company selected by the user
  async getPolicyTemplates(insAdd) {
    console.log("in in in in")
    if (insAdd) {
      this.setState({ insuranceAddress: insAdd })
      this.orgContract.methods.returnAllPolicy(insAdd).call(
        { from: this.state.account }, (error, policies) => {
          if (!error) {

            this.setState({
              insurancePolicies: policies
            })

          }
        }).then(policies => {

          const lengthp = policies.length

          if (lengthp > 0) {

            var policyTemplateABI = policyTemplate.abi

            let myarray = []
            for (let i = 0; i < policies.length; i++) {
              console.log("in ", policies[i], " length:", lengthp)
              var policyTemplateContractAddress = policies[i]
              var policyTemplateContract = new this.state.web3.eth.Contract(policyTemplateABI, policyTemplateContractAddress)


              policyTemplateContract.methods.getPolicyDetails().call(
                { from: this.state.account }, function (error, y) {

                  let obj = {

                  }
                  obj['coverage'] = y[0]
                  obj['policyName'] = y[1]


                  //push the record object into array of objects                        
                  myarray.push(obj)
                  // console.log(myarray)
                  this.setState({
                    policyDetails: myarray
                  }, () => {
                    console.log(this.state.policyDetails)
                  })
                }.bind(this))
            }
          }

        })
    }

  }

  //display policies based on the insurance company selected 
  showPolicies(policies, details) {
    if (policies.length != details.length)
      return;
    console.log("inside")
    const rows = policies.map((row, index) => {
      return (
        <tr key={index}>

          <td>{row}</td>
          <td>{details[index].policyName}</td>
          <td>{details[index].coverage} ether</td>

          <td>
            <Button

              block color="primary"
              size="lg"
              value={row}
              onClick={
                () => {
                  this.setState({ appliedAddress: row }, () => {
                    this.applyPolicy()
                  })
                }
              }
            ><b>Apply</b></Button></td>
        </tr>

      );

    });

    //return the table of records
    return rows
  }



  applyPolicy() {

    console.log("Insurance address:", this.state.insuranceAddress)
    sessionStorage.setItem('addressCompany', this.state.insuranceAddress)
    sessionStorage.setItem('policyState', 0)            

    this.state.web3.eth.getAccounts((error, accounts) => {
      //get the account from metamask
      this.UserContract.methods.login(sessionStorage.getItem('aadhaar')).call(
        { from: accounts[0] },
        (error, x) => {
          //check if account exists
          if (error) {
            alert("Wrong");
            return;
          }
          if (x === true) {
            //get address from aadhaar number
            this.UserContract.methods
              .getAddress(sessionStorage.getItem('aadhaar'))
              .call(
                { from: accounts[0] },
                (error, add) => {
                  //get account address from SC
                  if (error) {
                    alert("Wrong Details");
                    return;
                  }

                  //if account is valid
                  if (add === accounts[0]) {

                    var policyTemplateContractAddress = this.state.appliedAddress
                    var policyTemplateABI = policyTemplate.abi
                    var policyTemplateContract = new this.state.web3.eth.Contract(policyTemplateABI, policyTemplateContractAddress)
                    this.policyTemplateContract = policyTemplateContract
                    console.log(this.policyTemplateContract)

                    //Creating the policy contract
                    this.policyTemplateContract.methods.newPolicy(sessionStorage.getItem('aadhaar')).send(
                      {
                        from: accounts[0],
                        gasPrice: this.state.web3.utils.toHex(this.state.web3.utils.toWei('0', 'gwei')),
                        value: this.state.web3.utils.toHex(this.state.web3.utils.toWei('1', 'ether'))
                      }).then((policyContractInstance) => {
                        console.log("Policy:", policyContractInstance)

                        this.UserContract.methods
                          .getPolicyMap(sessionStorage.getItem('aadhaar'))
                          .call(
                            { from: accounts[0] },
                            (error, policyAdd) => {
                              this.setState({ policyContract: policyAdd })
                              sessionStorage.setItem('addressPolicy', policyAdd)
                            }
                          )

                      })
                  } else {
                    alert("Details Incorrect");
                  }
                }
              );
          } else {
            alert("Details Incorrect");
          }
        }
      );
    });

  }


  render() {
    //don't render if not loaded
    if (this.state.insuranceCompanies.length != this.state.insuranceAdds.length) {
      return <div></div>
    }
    else if (this.state.policyContract != null && this.state.insuranceAddress != null) {

      return (
        <div>
          <SharePolicy />
        </div>
      )
    }
    //render if loaded{policy:this.state.policyContract, company:this.state.insurnaceAddress}
    else {
      return (
        <div className="animated fadeIn">

          <Row>
            <Col md="9" lg="12" xl="12">
              <Card>

                <CardHeader>
                  <strong>Hospital</strong>
                </CardHeader>
                <CardBody>
                  <FormGroup row>

                    <Col xs="12" md="6">
                      <Input type="select" required={true} defaultValue="no-value" onChange={event => {
                        this.setState({ insuranceAddress: event.target.value })
                        this.getPolicyTemplates(event.target.value)
                      }}>
                        <option value="no-value" disabled>Select Insurance Company</option>
                        {this.insurancePopulate(this.state.insuranceAdds)}
                      </Input>

                    </Col>
                  </FormGroup>

                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Policy Address</th>
                        <th>PolicyName</th>
                        <th>Coverage</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.showPolicies(this.state.insurancePolicies, this.state.policyDetails)}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

      );
    }



  }

}


export default ApplyPolicy;
