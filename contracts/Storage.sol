pragma solidity ^0.4.24;

import "./UserDetails.sol";
import "./Organization.sol";

contract userDetailsInterface{
    function getAddress(uint _aadhaar) external view returns(address);
} 

contract organizationInterface{
    function getOrgName(address _address) external view returns(string);
    function recordUploaded(address _orgAddress, uint _recordID) public;
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
    mapping(address => uint[]) public ownerToRecord;
    
    mapping(uint => address) public recordToOwner;
    //mapping(address => uint) public OwnerRecordCount;
  
    //enter deployed userDetails contract Address here
    address userDetailsInterfaceAddress = 0x78478e7666bcb38b2ddeddfe7cb0ba152301df07; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);

    //instantiate organization interface here
    address organizationInterfaceAddress = 0xf5e9037a2412db50c74d5a1642d6d3b99dd90f20;
    organizationInterface organization = organizationInterface(organizationInterfaceAddress);
    

    function upload(uint _aadhaar, string _ipfsHash, string _type, string _name, string _masterkey) public returns(uint){
        //add require condition to check if address is of type hospital
       address addr = userdetails.getAddress(_aadhaar);
       string memory hospitalName = organization.getOrgName(msg.sender);
       uint id = records.push(Record(_ipfsHash,_type,_name,now,hospitalName,_masterkey)) - 1;
       ownerToRecord[addr].push(id);
       recordToOwner[id] = addr;
       organization.recordUploaded(msg.sender, id);
       return id;
    } 
    
    function retrieve(uint _aadhaar) external view returns(uint[]){
        address addr = userdetails.getAddress(_aadhaar);
        return ownerToRecord[addr];
    }

    function viewRecord(uint i) external view returns(string, string, string, uint, string, string){
        return (records[i].ipfsHash,records[i].rtype,records[i].rname,records[i].date,records[i].Hospital,records[i].masterkey);
    }
    
    function getRecordOwner(uint _id) external view returns(address){
        return recordToOwner[_id];
    }
    
    
    function getDetails(uint _id) external view returns(string, string, string, uint, string){
        return (records[_id].ipfsHash, records[_id].rname, records[_id].rtype, records[_id].date, records[_id].Hospital);
    }
    
    function reportDate(uint _aadhaar) external view returns(uint[]){
        address addr = userdetails.getAddress(_aadhaar);
        uint[] memory ids = ownerToRecord[addr];
        uint[] memory dates = new uint[](ids.length);
        for(uint i = 0 ; i < ids.length ; i++){
           dates[i] = records[ids[i]].date; 
        }
        return dates;
    }
}
