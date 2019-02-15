pragma solidity ^0.4.24;

contract Organization{

    // struct to store organization details
    struct organization{
        string orgName;
        string orgType;
        uint uniqueIdentifier;
        string keyHash;
    }

    mapping(address => organization) public orgToAddress;
    mapping(address => string) public orgToKey;
    
    address[] public orgAddresses;


    function orgSignUp(string _name, string _type, uint _identifier, string _ipfsHash) public{
        
        orgToAddress[msg.sender].orgName = _name;
        orgToAddress[msg.sender].orgType = _type;
        orgToAddress[msg.sender].uniqueIdentifier = _identifier;
        
        orgToKey[msg.sender] = _ipfsHash;
        
        orgAddresses.push(msg.sender);
    }
    
    function retAddresses() external view returns(address[]){
        return(orgAddresses);
    }
    
    function getOrgDetails(address _address) external view returns(string, string, uint){
        return(orgToAddress[_address].orgName,orgToAddress[_address].orgType,orgToAddress[_address].uniqueIdentifier);
    }
    
    function getOrgName(address _address) external view returns(string){
        return(orgToAddress[_address].orgName);
    }
    
    function getOrgType(address _address) external view returns(string){
        return(orgToAddress[_address].orgType);
    }
    
    function getKeyHash(address _address) external view returns(string){
        return(orgToKey[_address]);
    }
    
}