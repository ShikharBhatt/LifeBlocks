pragma solidity ^0.4.24;

import "./UserDetails.sol";

contract userDetailsInterface{
    function policyMap(uint _aadhaar, address _contract) public;
} 

contract PolicyTemplate{
     //enter deployed userDetails contract Address here
    address userDetailsInterfaceAddress = 0x78478e7666bcb38b2ddeddfe7cb0ba152301df07; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);
    
    // address of all deployed policy contracts
    address[] public policyContracts;
    address lastContractAddress;
    
    event newPolicyPurchase(address policyContractAddress);
    
    address owner;
    uint coverage;
    
    // ensure that caller of function is the owner of the contract
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    // set contract deployer as owner
    constructor(uint _coverage) public{
        owner = msg.sender;
        coverage = _coverage;
    }
    
    // get length of policyContracts array
    function getContractCount() onlyOwner external view returns(uint){
        return policyContracts.length;
    }
    
    function getContract(uint _position) onlyOwner external view returns(address){
        return policyContracts[_position];
    }
    
    function getOwner() external view returns(address){
        return owner;
    }
    
    // function to deploy new policy contract
    function newPolicy(uint _coverage, uint _aadhaar) public payable returns(address newPolicyContract){
        // check to ensure 1 ether was sent to the function call
        require(msg.value == 1 ether);

        Policy p = (new Policy).value(msg.value)(msg.sender,owner,_coverage);
        policyContracts.push(p);
        lastContractAddress = address(p);
        emit newPolicyPurchase(address(p));
        userdetails.policyMap(_aadhaar,lastContractAddress);
        return address(p);
    }
}

contract Policy{
    //to hold application fee
    uint value;
    address seller;
    address buyer;
    uint premium;
    uint coverage;
    uint dateApplied;
    uint startDate;
    uint graceDate;
    uint lapseDate;
    uint renewAppDate;
    uint penalty;
    
    enum State { Applied, Active, Grace, Lapsed, Renewal, Inactive, Defunct}
    State public state;
    State public prevState;
    
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
        //check if sent value is equal to premium set by insurance company 
        require(msg.value == premium);
        //policy start date
        startDate = now;
        //send premium to insurance company 
        seller.transfer(premium);
        //send application fee back to user
        buyer.transfer(value);
        //change policy state to active
        state = State.Active;
        //set grace date to 1 year after start date
        graceDate = startDate + 1 years;
        //set grace date to 4 weeks after grace date
        lapseDate = graceDate + 4 weeks;
    }
    
    //test function
    function getDetails() external view returns(address, address, uint, State, uint, uint, uint, uint){
        return (seller,buyer,value,state,this.balance,startDate,graceDate,lapseDate);
    }

    function policyGrace(uint _timestamp) onlySeller inState(State.Active) public{
        if(_timestamp > graceDate){
            state = State.Grace;
        }
    }
    
    function getPremium() external view returns(uint){
        return(premium);
    }
    
    function policyLapse(uint _timestamp) onlySeller inState(State.Grace) public{
        if(_timestamp > lapseDate){
            state = State.Lapsed;
            penalty = (5 * premium)/100;
        }
    }
    
    function policyInactive(uint _timestamp) onlySeller inState(State.Lapsed) public{
        if(_timestamp > lapseDate){
            state = State.Inactive;
            penalty = (10 * premium)/100;
        }
    }
    
    function renewPolicy(uint _coverage) onlyBuyer public {
        renewAppDate = now;
        coverage = _coverage;
        prevState = state;
        state = State.Renewal;
    }
    
    function confirmRenewal() onlyBuyer inState(State.Renewal) public payable{
        if(prevState == State.Grace){
            require(msg.value == premium);
            startDate = now;
            //change policy state to active
            state = State.Active;
            //set grace date to 1 year after start date
            graceDate = startDate + 1 years;
            //set grace date to 4 weeks after grace date
            lapseDate = graceDate + 4 weeks;
            seller.transfer(this.balance);
        }
        else if(prevState == State.Lapsed){
            require(msg.value == premium + penalty);
            startDate = now;
            //change policy state to active
            state = State.Active;
            //set grace date to 1 year after start date
            graceDate = startDate + 1 years;
            //set grace date to 4 weeks after grace date
            lapseDate = graceDate + 4 weeks;
            seller.transfer(this.balance);
        }
        else if(prevState == State.Inactive)
            require(msg.value == premium + penalty);
            startDate = now;
            //change policy state to active
            state = State.Active;
            //set grace date to 1 year after start date
            graceDate = startDate + 1 years;
            //set grace date to 4 weeks after grace date
            lapseDate = graceDate + 4 weeks;
            seller.transfer(this.balance);
    }
    
    
}