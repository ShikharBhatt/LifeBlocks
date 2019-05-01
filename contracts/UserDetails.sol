pragma solidity ^0.4.24;

contract userDetails{
    
    event addressLinked(address _address, uint _aadhaar);
    event keyLinked(address _address, string _ipfshash);

    //create mapping(key => value) : (aadhaar => address)
    mapping(uint => address) public aadhaarToAddress;

    //create mapping(key => value) : (adress => aadhaar)
    mapping(address => uint) public addressToAadhaar;

    // create mappoing between user address and pgp key file stored on ipfs
    mapping(address => string) public ownerToKey;
    
    //create mapping between user aadhaar and policy contract
    mapping(uint => address) public ownerToPolicy;
     
    // function to link aadhaar card to user's ethereum address  
    function link(uint _aadhaar, string _ipfskey) public{
        //ensure user can call this function only once
        //enusres one to one mapping between user's address and aadhaar card
        require(aadhaarToAddress[_aadhaar] == 0x0000000000000000000000000000000000000000,"Aadhar Card already exists");
        require(addressToAadhaar[msg.sender] == 0,"Address already used");
        //ensure key pair has not been generated for user
        require(bytes(ownerToKey[msg.sender]).length == 0,"Key pair for user already exists");

        //map msg sender to aadhaar card no.
        aadhaarToAddress[_aadhaar] = msg.sender;
        addressToAadhaar[msg.sender] = _aadhaar;
        
        //fire event for logging
        emit addressLinked(msg.sender, _aadhaar);


        //map address to key file on ipfs
        ownerToKey[msg.sender] = _ipfskey;

        //fire event for logging
        emit keyLinked(msg.sender, _ipfskey);
        
    }
    
    function login(uint _aadhaar) external view returns(bool){
        //ensure valid, registered users call this function
        require(aadhaarToAddress[_aadhaar] != 0x0000000000000000000000000000000000000000,"Account does not exist");
        
        //check if msg sender 
        return(aadhaarToAddress[_aadhaar] == msg.sender);
    }

    function getAddress(uint _aadhaar) external view returns(address){
        return(aadhaarToAddress[_aadhaar]); 
    }

    function getKeyHash(uint _aadhaar) external view returns(string){
        return(ownerToKey[aadhaarToAddress[_aadhaar]]);
    }
    
    function policyMap(uint _aadhaar, address _contract) public {
        ownerToPolicy[_aadhaar] = _contract;
    }
    
    function getPolicyMap(uint _aadhaar) external view returns(address){
        return(ownerToPolicy[_aadhaar]);
    }
}
