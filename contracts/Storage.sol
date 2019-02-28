pragma solidity ^0.4.24;

import "./UserDetails.sol";
import "./Organization.sol";

contract userDetailsInterface{
    function getAddress(uint _aadhaar) external view returns(address);
} 

contract organizationInterface{
    function getOrgName(address _address) external view returns(string);
}

contract Storage{

    struct Record{
        string ipfsHash;
        string rtype;
        string rname;
        uint date;
        string Hospital;
        string masterkey;
    }
    
    Record[] public records;

    //mapping patient address to medical record
    mapping(uint => address) public RecordtoOwner;
    
    mapping(address => uint) public OwnerRecordCount;
  
    //enter deployed userDetails contract Address here
    address userDetailsInterfaceAddress = 0x5559291517fd70189de6e56c0f0e97917c9c4cb6; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);

    //instantiate organization interface here
    address organizationInterfaceAddress = 0xe46b2d8b3a5ccf2df628468dee2f3ec1e85e7a28;
    organizationInterface organization = organizationInterface(organizationInterfaceAddress);
    

    function upload(uint _aadhaar, string _ipfsHash, string _type, string _name, string _masterkey) public{
        //add require condition to check if address is of type hospital
       address addr = userdetails.getAddress(_aadhaar);
       string memory hospitalName = organization.getOrgName(msg.sender);
       uint id = records.push(Record(_ipfsHash,_type,_name,now,hospitalName,_masterkey)) - 1;
       RecordtoOwner[id] = addr;
       OwnerRecordCount[addr]++;
    } 
    
    function retrieve(uint _aadhaar) external view returns(uint[]){
        address addr = userdetails.getAddress(_aadhaar);
        uint counter = 0;
        uint[] memory recordId = new uint[](OwnerRecordCount[addr]);
        for(uint i = 0;i<records.length;i++){
            if(RecordtoOwner[i] == addr){
                recordId[counter] = i;
                counter ++;
            }
        }
        return recordId;
    }

    function viewRecord(uint i) external view returns(string, string, string, uint, string, string){
        return (records[i].ipfsHash,records[i].rtype,records[i].rname,records[i].date,records[i].Hospital,records[i].masterkey);
    }
}
