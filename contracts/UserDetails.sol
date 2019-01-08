pragma solidity ^0.4.24;

contract userDetails{
    
    event addressLinked(address _address, uint _aadhaar);

    //create mapping between user address and aadhaar card no.
    mapping(uint => address) public aadhaarToOwner;

    // create mappoing between user address and pgp key file stored on ipfs
    mapping(address => string) public ownerToKey;
     
    function link(uint _aadhaar) public{
        //ensure user can call this function only once
        require(aadhaarToOwner[_aadhaar] == 0x0000000000000000000000000000000000000000,"Aadhar Card already exists");
        
        //map msg sender to aadhaar card no.
        aadhaarToOwner[_aadhaar] = msg.sender;
        
        //fire event for logging
        emit addressLinked(msg.sender, _aadhaar);
    }
    
    function login(uint _aadhaar) external view returns(bool){
        //ensure valid, registered users call this function
        require(aadhaarToOwner[_aadhaar] != 0x0000000000000000000000000000000000000000,"Account does not exist");
        
        //check if msg sender 
        return(aadhaarToOwner[_aadhaar] == msg.sender);
    }

    function getAddress(uint _aadhaar) external view returns(address){
       return(aadhaarToOwner[_aadhaar]); 
    }

    function keymap(string key_ipfs) public{
        require(bytes(ownerToKey[msg.sender]).length == 0,"Key pair for user already exists");
        ownerToKey[msg.sender] = key_ipfs;
    } 
}
