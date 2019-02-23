pragma solidity ^0.4.24;

import "./UserDetails.sol";

contract userDetailsInterface{
    function policyMap(uint _aadhaar, address _contract) external view returns(address);
} 

contract PolicyTemplate{
     //enter deployed userDetails contract Address here
    address userDetailsInterfaceAddress = 0x78478e7666bcb38b2ddeddfe7cb0ba152301df07; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);
    
    // address of all deployed policy contracts
    address[] public policyContracts;
    address public lastContractAddress;
    
    event newP(address policyContractAddress);
    
    address owner;
    
    // ensure that caller of function is the owner of the contract
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    // set contract deployer as owner
    constructor() public{
        owner = msg.sender;
    }
    
    // get length of policyContracts array
    function getContractCount() onlyOwner public returns(uint){
        return policyContracts.length;
    }
    
    function getContract(uint _position) onlyOwner public returns(address){
        return policyContracts[_position];
    }
    
    function getOwner() public returns(address){
        return owner;
    }
    
    // function to deploy new policy contract
    function newPolicy(uint _coverage, uint _aadhaar) public payable returns(address newPolicyContract){
        // check to ensure 1 ether was sent to the function call
        require(msg.value == 1 ether);
        
        Policy p = (new Policy).value(msg.value)(msg.sender,owner,_coverage);
        policyContracts.push(p);
        lastContractAddress = p;
        userdetails.policyMap(_aadhaar,p);
        emit newP(p);
        return p;
    }
}

contract Policy{
    
   
    uint public value;
    address public seller;
    address public buyer;
    uint public premium;
    uint public coverage;
    uint public dateApplied;
    uint public startDate;
    uint public graceDate;
    uint public lapseDate;
    uint penalty;
    
    enum State { Applied, Active, Grace, Lapsed, Renewal, Inactive, Defunct}
    State public state;
    
    modifier onlyBuyer(){
        require(msg.sender == buyer);
        _;
    }
    
    modifier onlySeller(){
        require(msg.sender == seller);
        _;
    }
    
    modifier inState(State _state){
        require(state == _state);
        _;
    }
    
    constructor(address contractBuyer, address contractSeller, uint _coverage) public payable {
        buyer = contractBuyer;
        value = msg.value;
        seller = contractSeller;
        dateApplied = now;
        coverage = _coverage;
        state = State.Applied;
    }
    
    function setPremium(uint _premium) onlySeller inState(State.Applied) public{
        premium = _premium;
    }
    
    function confirmPolicy() onlyBuyer inState(State.Applied) public payable{
        require(msg.value == premium);
        startDate = now;
        seller.transfer(premium);
        buyer.transfer(this.balance);
        state = State.Active;
        graceDate = startDate + 1 years;
        lapseDate = graceDate + 4 weeks;
    }
    
    function getDetails() public returns(address, address, uint, State, uint, uint, uint, uint){
        return (seller,buyer,value,state,this.balance,startDate,graceDate,lapseDate);
    }

    function policyGrace(uint _timestamp) onlySeller inState(State.Active) public{
        if(_timestamp > graceDate){
            state = State.Grace;
        }
    }
    
    function policyLapse(uint _timestamp) onlySeller inState(State.Grace) public{
        if(_timestamp > lapseDate){
            state = State.Lapsed;
        }
    }
    
    function policyRenew() onlyBuyer public payable{
        if(state == State.Grace){
            require(msg.value == premium);
        }
        else if(state == State.Lapsed){
            require(msg.value == premium + penalty);
            
        }
    }
    
}