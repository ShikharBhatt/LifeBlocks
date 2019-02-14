pragma solidity ^0.4.24;

contract Organization{

    // struct to store organization details
    struct organization{
        string org_name;
        string org_type;
        uint unique_identifier;
    }

    mapping(address => organization) public orgToAddress;
    
    address[] public orgAddresses;


    function orgSignUp(string _name, string _type, uint _identifier) public{
        
        orgToAddress[msg.sender].org_name = _name;
        orgToAddress[msg.sender].org_type = _type;
        orgToAddress[msg.sender].unique_identifier = _identifier;
        
        orgAddresses.push(msg.sender);
    }
    
    function retAddresses() external view returns(address[]){
        return(orgAddresses);
    }
    
    function getOrgDetails(address _address) external view returns(string, string, uint){
        return(orgToAddress[_address].org_name,orgToAddress[_address].org_type,orgToAddress[_address].unique_identifier);
    }
    
    function getOrgName(address _address) external view returns(string){
        return(orgToAddress[_address].org_name);
    }
    
    function getOrgType(address _address) external view returns(string){
        return(orgToAddress[_address].org_type);
    }
}