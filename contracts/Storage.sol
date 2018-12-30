pragma solidity ^0.4.0;

import "./UserDetails.sol";

contract userDetailsInterface{
    function getAddress(uint _aadhar) external view returns(address);
} 


contract Storage{

    struct Record{
        string ipfsHash;
        string rtype;
        address Hospital;
    }
    
    Record[] public records;

    //mapping patient address to medical record
    mapping(uint => address) public RecordtoOwner;
    
    mapping(address => uint) public OwnerRecordCount;
    
    address userDetailsInterfaceAddress = //enter deployed userDetails contract Address here;
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);
    

    function upload(uint _aadhar,string _ipfsHash,string _type) public{
        //add require condition to check if address is of type hospital
       address addr = userdetails.getAddress(_aadhar);
       uint id = records.push(Record(_ipfsHash,_type,msg.sender));
       RecordtoOwner[id] = addr;
       OwnerRecordCount[addr]++;
    } 
    
    function retrieve(uint _aadhar) external view returns(uint[]){
        address addr = userdetails.getAddress(_aadhar);
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

    function viewRecord(uint i) external view returns(string, string, address){
        return (records[i].ipfsHash,records[i].rtype,records[i].Hospital);
    }
}
