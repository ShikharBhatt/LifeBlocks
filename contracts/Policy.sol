pragma solidity ^0.4.24;

import "./UserDetails.sol";

contract userDetailsInterface{
    function policyMap(uint _aadhaar, address _contract) public;
} 

contract permissionInterface{
    function grant(uint recordID, address _to, string _masterkey, address _onwer) public returns(uint);
}

contract storageInterface{
    function upload(uint _aadhaar, string _ipfsHash, string _type, string _name, string _masterkey) public returns(uint);
    function getDetails(uint _id) external view returns(string, string, string, uint, string);
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
    uint penalty;
    uint[] plist;
    string reason = "Records not submitted";
    uint coverage_amt;
    uint claim_count;
    uint current_claim;
    uint claim_amt;
    uint claim_record_id;
    string claim_reason;

    address permissionInterfaceAddress = 0xafb27a2deb77ca90ed435326904ca257635cbf2f;
    permissionInterface permissions = permissionInterface(permissionInterfaceAddress);
    
    address storageInterfaceAddress = 0xf3f0fac080e7babdc06dc5a2e2f68f36116a31c0;
    storageInterface storage_contract = storageInterface(storageInterfaceAddress); 
    
    
    enum State { AppliedWOR, Applied, AppliedSP, Active, Grace, Lapsed, RenewalWOR, Renewal, RenewalSP, Defunct}
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
        coverage = _coverage * 1 ether;
        coverage_amt = _coverage;
        state = State.AppliedWOR;
    }
    
    function getDetails() external view returns(address, address, uint, State, uint, uint, uint, uint, uint, string, uint[], uint, uint){
        return (seller, buyer, value, state, coverage, dateApplied, startDate, graceDate, lapseDate, reason, plist, penalty, current_claim);
    }
    
    function getClaimDetails() external view returns(uint, uint, uint, string){
        return(claim_amt, claim_count, claim_record_id, claim_reason);
    }
    
    
    function getState() external view returns(State){
        return state;
    }

    function getPremium() external view returns(uint){
        return(premium);
    }
    
    function getPenalty() external view returns(uint){
        return penalty;
    }

    function getRecordsApplied(uint recordID, string _masterkey) onlyBuyer inState(State.AppliedWOR) public{
        uint pid = permissions.grant(recordID, seller, _masterkey, buyer);
        plist.push(pid);
    }
    
    function applyPolicy() inState(State.AppliedWOR) public {
        state = State.Applied;
        reason = "Records submitted";
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

    function setPremium(uint _premium) onlySeller public{
        premium = _premium * 1 ether;
        if(state == State.Applied)
            state = State.AppliedSP;
        else if(state == State.Renewal)
            state = State.RenewalSP;
        
        reason = "Premium payment pending";
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
        reason = "Policy Active";
    }

    function policyGrace() onlySeller inState(State.Active) public{
            state = State.Grace;
            reason = "Policy Expired";
    }
    
    function extendPolicy() onlyBuyer public payable{
            require(state == State.Active || state == State.Grace, "There is something wrong with your application");
            require(msg.value == premium);
            startDate = now;
            //change policy state to active
            state = State.Active;
            //set grace date to 1 year after start date
            graceDate = startDate + 1 years;
            //set grace date to 4 weeks after grace date
            lapseDate = graceDate + 4 weeks;
            seller.transfer(this.balance);
            reason = "Policy Active";
            if(claim_count == 0)
                coverage = (coverage_amt + ((5 * coverage_amt)/100)) * 1 ether;
            else
                coverage = coverage_amt * 1 ether;
    }

    function policyLapse() onlySeller inState(State.Grace) public{
            state = State.Lapsed;
            penalty = (5 * premium)/100;
            reason = "Policy Lapsed. Please follow the policy renewal procedure to continue recieving health coverage";
    }

    function renewPolicy() onlyBuyer public {
        dateApplied = now;
        state = State.RenewalWOR;
        reason = "Records not submitted";
    }

    function getRecordsRenewal(uint recordID, string _masterkey) onlyBuyer inState(State.RenewalWOR) public{
        uint pid = permissions.grant(recordID, seller, _masterkey, buyer);
        plist.push(pid);
    }
    
    function renewalPolicy() inState(State.RenewalWOR) public {
        state = State.Renewal;
        reason = "Records submitted";
    }
    
    function confirmRenewal() onlyBuyer inState(State.RenewalSP) public payable{
            require(msg.value == premium + penalty);
            startDate = now;
            //change policy state to active
            state = State.Active;
            //set grace date to 1 year after start date
            graceDate = startDate + 1 years;
            //set grace date to 4 weeks after grace date
            lapseDate = graceDate + 4 weeks;
            seller.transfer(this.balance);
            reason = "Policy Active";
            coverage = coverage_amt * 1 ether;
    }
    
    function policyDefunct() onlySeller public{
            require(state == State.Applied || state == State.Lapsed);
            state = State.Defunct;
            if(state == State.Lapsed)
                reason = "Policy Defunct. Please apply for a new policy to continue recieving health coverage";
    }
    
    function rejectApplication(string _reason) onlySeller inState(State.Applied) public {
            reason = _reason;
            policyDefunct();
    }
    
    function claim(uint _claim_amt, uint _aadhaar, string _ipfsHash, string _type, string _name, string _masterkey){
        claim_amt = _claim_amt * 1 ether;
        claim_record_id = storage_contract.upload(_aadhaar,_ipfsHash,_type,_name,_masterkey);
        claim_count++;
        current_claim = 1;
    }
    
    function acceptClaim() onlySeller public payable{
        require(msg.value == claim_amt);
        buyer.transfer(msg.value);
        current_claim = 0;
        coverage = coverage - claim_amt;
    }
    
    function rejectClaim(string _claim_reason) onlySeller public{
        current_claim = 0;
        claim_reason = _claim_reason;
    }
    
}