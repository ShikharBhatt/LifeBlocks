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
    }
    
    Record[] public records;

    //mapping patient address to medical record
    mapping(address => uint[]) public ownerToRecord;
    
    mapping(uint => address) public recordToOwner;
    //mapping(address => uint) public OwnerRecordCount;
  
    //enter deployed userDetails contract Address here
    address userDetailsInterfaceAddress = 0x9240ddc345d7084cc775eb65f91f7194dbbb48d8; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);

    //instantiate organization interface here
    address organizationInterfaceAddress = 0xa5a2075994ca25397b8dab82e4834c1b09051d57;
    organizationInterface organization = organizationInterface(organizationInterfaceAddress);
    

    function upload(uint _aadhaar, string _ipfsHash, string _type, string _name) public{
        //add require condition to check if address is of type hospital
       address addr = userdetails.getAddress(_aadhaar);
       string memory hospitalName = organization.getOrgName(msg.sender);
       uint id = records.push(Record(_ipfsHash,_type,_name,now,hospitalName)) - 1;
       ownerToRecord[addr].push(id);
       recordToOwner[id] = addr;
    //   OwnerRecordCount[addr]++;
    } 
    
    function retrieve(uint _aadhaar) external view returns(uint[]){
        address addr = userdetails.getAddress(_aadhaar);
        return ownerToRecord[addr];
    }

    function viewRecord(uint i) external view returns(string, string, string, uint, string){
        return (records[i].ipfsHash,records[i].rtype,records[i].rname,records[i].date,records[i].Hospital);
    }
    
    function getRecordOwner(uint _id) external view returns(address){
        return recordToOwner[_id];
    }
    
    function getDetails(uint _id) external view returns(string, string, string, uint, string){
        return (records[_id].ipfsHash, records[_id].rname, records[_id].rtype, records[_id].date, records[_id].Hospital);
    }
}
