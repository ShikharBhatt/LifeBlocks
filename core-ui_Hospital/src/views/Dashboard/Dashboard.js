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
} from "reactstrap";

import ipfs from "../../Dependencies/ipfs";
import { encrypt } from "../../Dependencies/crypto";
import { getKeys,keyEncrypt } from "../../Dependencies/pgp";
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
      rtype: "",
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
    //this.toggle = this.toggle.bind(this);
    // this.state = {
    //   dropdownOpen: new Array(19).fill(false)
    // };
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
    //Initialize user details contract
    const userContractAddress = "0x78478e7666bcb38b2ddeddfe7cb0ba152301df07";
    const userABI = [{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"login","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"aadhaarToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfskey","type":"string"}],"name":"link","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressToAadhaar","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"getKeyHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_aadhaar","type":"uint256"}],"name":"addressLinked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"_ipfshash","type":"string"}],"name":"keyLinked","type":"event"}]
    var userContract = new this.state.web3.eth.Contract(userABI, userContractAddress);
    this.userContract = userContract;
    //Initialize storage contract
    const storageContractAddress = "0xf3f0fac080e7babdc06dc5a2e2f68f36116a31c0";
    const storageABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"records","outputs":[{"name":"ipfsHash","type":"string"},{"name":"rtype","type":"string"},{"name":"rname","type":"string"},{"name":"date","type":"uint256"},{"name":"Hospital","type":"string"},{"name":"masterkey","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"RecordtoOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"OwnerRecordCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"i","type":"uint256"}],"name":"viewRecord","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_aadhaar","type":"uint256"}],"name":"retrieve","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aadhaar","type":"uint256"},{"name":"_ipfsHash","type":"string"},{"name":"_type","type":"string"},{"name":"_name","type":"string"},{"name":"_masterkey","type":"string"}],"name":"upload","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    var storageContract = new this.state.web3.eth.Contract(storageABI, storageContractAddress);
    this.storageContract = storageContract;
    console.log("storage contract: " + this.storageContract);
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

    event.preventDefault()
    console.log(this.buffer);
    var encrypted = encrypt(this.buffer);
    const masterkey = encrypted[0];
    this.buffer = Buffer(encrypted[1]);
    console.log(masterkey)
    console.log(encrypted);
    let keyObj,m_key,record

    record = this.buffer
    this.state.web3.eth.getAccounts((error, accounts) => {          
          //transaction to link aadhaar card to address
         this.userContract.methods.getKeyHash(this.state.aadhaar).call(
           {from:accounts[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))}).then((ipfsHash) =>{
          
            getKeys(ipfsHash,function(key){
              //in callback function of getKeys 
                keyObj = JSON.parse(key)
                //console.log(this.state.aadhaar)
                  console.log("key object: "+keyObj)
                  console.log("key object type: "+ typeof keyObj)
                  console.log("public key : "+keyObj.publicKeyArmored)
                  console.log(Object.getOwnPropertyNames(keyObj))
                  keyEncrypt(masterkey,keyObj,function(cipher){
                    //in callback function of keyEncrypt
                    m_key = cipher
                    console.log("encrypted masterkey: "+m_key)        
                  })
              })                
           })
            ipfs.files.add(record, (error, result) => {
              if(error) {
                console.error(error)
                return
              }
              else{
                alert(result[0].hash + this.state.aadhaar+this.state.rtype+this.state.rname)
                this.storageContract.methods.upload(this.state.aadhaar, result[0].hash,this.state.rtype,this.state.rname,m_key).send({from:accounts[0],gasPrice:this.state.web3.utils.toHex(this.state.web3.utils.toWei('0','gwei'))}, function(error, txHash){ 
              if(!error)  {
                console.log("tx: "+txHash)                   
                alert('Transaction Hash:'+txHash)
              }
              else
                console.log(error)
              })
            }
          })     
  })
}

  render() {
    return (
      <div className="App">
        <div className="animated fadeIn">
          <Card>
          <Form
                onSubmit={this.onSubmit}
                method="post"
                encType="multipart/form-data"
                className="form-horizontal">
            
            <CardHeader>
              <strong>Hospital</strong>
            </CardHeader>
            <CardBody>
              
                
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Enter patient's Aadhaar :</Label>
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
                    <Label htmlFor="input">Record Name :</Label>
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
                    <Label htmlFor="select">Record Type :</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="select" onChange={event => this.setState({ rtype:event.target.value })} required={true}>
                      <option selected disabled>Select Record Type</option>
                      <option value="Routine">Routine</option>
                      <option value="Sensitive">Sensitive</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Claim">Claim</option>
                    </Input>
                  </Col>
                </FormGroup>
                
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="file-input">Upload File :</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="file" onChange={this.captureFile} required={true}/>
                  </Col>
                </FormGroup>
                            
            </CardBody>

            <CardFooter>
              <Button type="submit" size="md" color="primary">
                <i className="fa fa-dot-circle-o" /> Submit
              </Button>
              <Button type="reset" size="md" color="danger">
                <i className="fa fa-ban" /> Reset
              </Button>
            </CardFooter>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}

export default Dashboard;
