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
    mapping(address => uint[]) public ownerToRecord;
    
    //mapping(address => uint) public OwnerRecordCount;
  
    //enter deployed userDetails contract Address here
    address userDetailsInterfaceAddress = 0x78478e7666bcb38b2ddeddfe7cb0ba152301df07; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);

    //instantiate organization interface here
    address organizationInterfaceAddress = 0xf5e9037a2412db50c74d5a1642d6d3b99dd90f20;
    organizationInterface organization = organizationInterface(organizationInterfaceAddress);
    

    function upload(uint _aadhaar, string _ipfsHash, string _type, string _name, string _masterkey) public{
        //add require condition to check if address is of type hospital
       address addr = userdetails.getAddress(_aadhaar);
       string memory hospitalName = organization.getOrgName(msg.sender);
       uint id = records.push(Record(_ipfsHash,_type,_name,now,hospitalName,_masterkey)) - 1;
       ownerToRecord[addr].push(id);
    //   OwnerRecordCount[addr]++;
    } 
    
    function retrieve(uint _aadhaar) external view returns(uint[]){
        address addr = userdetails.getAddress(_aadhaar);
        return ownerToRecord[addr];
    }

    function viewRecord(uint i) external view returns(string, string, string, uint, string, string){
        return (records[i].ipfsHash,records[i].rtype,records[i].rname,records[i].date,records[i].Hospital,records[i].masterkey);
    }
}
