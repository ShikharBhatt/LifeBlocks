pragma solidity ^0.4.24;

import "./UserDetails.sol";

contract userDetailsInterface{
    function getAddress(uint _aadhaar) external view returns(address);
    function getKeyHash(uint _aadhaar) external view returns(string);
} 


contract Storage{

    struct Record{
        string ipfsHash;
        string rtype;
        string rname;
        address Hospital;
        string masterkey;
    }
    
    Record[] public records;

    //mapping patient address to medical record
    mapping(uint => address) public RecordtoOwner;
    
    mapping(address => uint) public OwnerRecordCount;
  
    //enter deployed userDetails contract Address here
    address userDetailsInterfaceAddress = 0x78478e7666bcb38b2ddeddfe7cb0ba152301df07; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);
    

    function upload(uint _aadhaar, string _ipfsHash, string _type, string _name, string _masterkey) public{
        //add require condition to check if address is of type hospital
       address addr = userdetails.getAddress(_aadhaar);
       uint id = records.push(Record(_ipfsHash,_type,_name,msg.sender,_masterkey));
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

    function viewRecord(uint i) external view returns(string, string, string, address, string){
        return (records[i].ipfsHash,records[i].rtype,records[i].rname,records[i].Hospital,records[i].masterkey);
    }
}
