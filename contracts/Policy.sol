pragma solidity ^0.4.24;

import "./UserDetails.sol";

contract userDetailsInterface{
    function policyMap(uint _aadhaar, address _contract) public;
} 

contract permissionInterface{
    function grant(uint recordID, address _to, string _masterkey, address _onwer) public returns(uint);
}

contract PolicyTemplate{
     //enter deployed userDetails contract Address here
    address userDetailsInterfaceAddress = 0x78478e7666bcb38b2ddeddfe7cb0ba152301df07; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);
    
    // address of all deployed policy contracts
    address[] public policyContracts;
    address lastContractAddress;
    string policyName;
    
    event newPolicyPurchase(address policyContractAddress);
    
    address owner;
    uint coverage;
    
    // ensure that caller of function is the owner of the contract
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    // set contract deployer as owner
    constructor(uint _coverage, string _name) public{
        owner = msg.sender;
        coverage = _coverage;
        policyName = _name;
    }
    
    function getPolicyDetails() external view returns(uint, string){
        return(coverage,policyName);
    }
    
    // get length of policyContracts array 
    function getContractCount() onlyOwner external view returns(uint){
        return policyContracts.length;
    }
    
    function getContract(uint _position) onlyOwner external view returns(address){
        return policyContracts[_position];
    }
    
    function getPolicies() onlyOwner external view returns(address[]){
        return policyContracts;
    }

    
    function getOwner() external view returns(address){
        return owner;
    }
    
    // function to deploy new policy contract
    function newPolicy(uint _aadhaar) public payable returns(address newPolicyContract){
        // check to ensure 1 ether was sent to the function call
        require(msg.value == 1 ether);

        Policy p = (new Policy).value(msg.value)(msg.sender,owner,coverage);
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
    uint[] plist;
    string reason = "Records not submitted";
    
    address permissionInterfaceAddress = 0xafb27a2deb77ca90ed435326904ca257635cbf2f;
    permissionInterface permissions = permissionInterface(permissionInterfaceAddress);
    
    
    enum State { AppliedWOR, Applied, AppliedSP, Active, Grace, Lapsed, RenewalWOR, Renewal, Inactive, Defunct}
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
        state = State.AppliedWOR;
    }
    
    function getRecordsApplied(uint recordID, string _masterkey) onlyBuyer inState(State.AppliedWOR) public{
        uint pid = permissions.grant(recordID, seller, _masterkey, buyer);
        plist.push(pid);
    }
    
    function applyPolicy() inState(State.AppliedWOR) public {
        state = State.Applied;
    }
    
    function getRecordsRenewal(uint recordID, string _masterkey) onlyBuyer inState(State.RenewalWOR) public{
        uint pid = permissions.grant(recordID, seller, _masterkey, buyer);
        plist.push(pid);
    }
    
    function renewPolicy() inState(State.RenewalWOR) public {
        state = State.Renewal;
    }
    
    function getRecords() onlySeller onlyBuyer external view returns(uint[]){
        return(plist);
    }
    
    function requestRecords(string _reason) onlySeller public{
        require(state == State.Applied || state == State.Renewal, "Invalid State");
        
        if(state == State.Applied){
            reason = _reason;
            state = State.AppliedWOR;
        }
        
        else if(state == State.Renewal){
            reason = _reason;
            state = State.RenewalWOR;
        }
    }
    
    function setPremium(uint _premium) onlySeller inState(State.Applied) public{
        premium = _premium;
        state = State.AppliedSP;
    }
    
    function confirmPolicy() onlyBuyer inState(State.AppliedSP) public payable{
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
    function getDetails() external view returns(address, address, uint, State, uint, uint, uint, uint, uint, string, uint[]){
        return (seller, buyer, value, state, this.balance, dateApplied, startDate, graceDate, lapseDate, reason, plist);
    }

    function policyGrace() onlySeller inState(State.Active) public{
            state = State.Grace;
    }
    
    function getPremium() external view returns(uint){
        return(premium);
    }
    
    function policyLapse() onlySeller inState(State.Grace) public{
            state = State.Lapsed;
            penalty = (5 * premium)/100;
    }
    
    function policyInactive() onlySeller inState(State.Lapsed) public{
            state = State.Inactive;
            penalty = (10 * premium)/100;
    }
    
    function renewPolicy(uint _coverage) onlyBuyer public {
        renewAppDate = now;
        coverage = _coverage;
        prevState = state;
        state = State.RenewalWOR;
        reason = "Records not submitted";
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
    
    function getState() external view returns(State){
        return state;
    }
}