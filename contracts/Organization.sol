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
    mapping(address => address[]) public sellerToPolicy;
    mapping(address => uint[]) recordUploader;
    uint hospitalCount;
    uint insuranceCount;
    
    address[] public orgAddresses;


    function orgSignUp(string _name, string _type, uint _identifier, string _ipfsHash) public{
        
        orgToAddress[msg.sender].orgName = _name;
        orgToAddress[msg.sender].orgType = _type;
        orgToAddress[msg.sender].uniqueIdentifier = _identifier;
        
        orgToKey[msg.sender] = _ipfsHash;
        
        orgAddresses.push(msg.sender);
        
        if(keccak256(_type) == keccak256("Hospital")){
            hospitalCount++;
        }
        else if(keccak256(_type) == keccak256("Insurance")){
            insuranceCount++;
        }
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
    
    function retrieveType(string _type) external view returns(address[]){
        uint counter = 0;
        uint j=0;
        uint limit;
        
        if(keccak256(_type) == keccak256("Hospital")){
            limit  = hospitalCount;
        }
        else if(keccak256(_type) == keccak256("Insurance")){
            limit = insuranceCount;    
        }
        
        address[] memory addresses = new address[](limit);
        for(uint i = 0;i<orgAddresses.length;i++){
            if(keccak256(orgToAddress[orgAddresses[i]].orgType) == keccak256(_type)){
                addresses[j] = orgAddresses[i];
                counter ++;
                j++;
            }
        }
        return addresses;
    }
    
    function addPolicy(address _contractAddress) public{
        sellerToPolicy[msg.sender].push(_contractAddress);
    } 
    
    function returnAllPolicy(address _orgAddress) external view returns(address[]){
        return sellerToPolicy[_orgAddress];
    }

    function recordUploaded(uint _recordID) public {
        recordUploader[msg.sender].push(_recordID);
    }
    
    function getOrgRecords(address _orgAddress) external view returns(uint[]){
        require(_orgAddress == msg.sender, "You do not have sufficient permissions to access these records");
        return recordUploader[_orgAddress];
    }
}