pragma solidity ^0.4.24;

import "./Storage.sol";

contract storageInterface{
    function getRecordOwner(uint _id) external view returns(address);
    function getDetails(uint _id) external view returns(string, string, string, uint, string);
}

contract Permissions{
    
    address storageInterfaceAddress = 0xf5e9037a2412db50c74d5a1642d6d3b99dd90f20;
    storageInterface storage_contract = storageInterface(storageInterfaceAddress);
    
    modifier recordOwner(uint _rid){
        require(storage_contract.getRecordOwner(_rid) == msg.sender);
        _;
    }
    
    modifier permission_participants(uint _pid){
        require(permission_list[_pid].from == msg.sender || permission_list[_pid].to == msg.sender);
        _;
    }

    struct permission{
        address to;
        address from;
        uint recordID;
        string masterkey;
        bool status;
    } 

    permission[] permission_list;

    mapping(address => uint[]) permissionFrom;

    address userDetailsInterfaceAddress = 0x78478e7666bcb38b2ddeddfe7cb0ba152301df07; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);

    function grant(uint recordID, address _to, string _masterkey) recordOwner(recordID) public{
        uint id = permission_list.push(permission(_to, msg.sender, recordID, _masterkey, true)) -1;
        permissionFrom[msg.sender].push(id);
    }
    
    function revoke(uint _id) public {
        require(permission_list[_id].from == msg.sender, "You are not authorized");
        permission_list[_id].status = false;
    }
    
    function getPermissionList(address _from) external view returns(uint[]){
        return(permissionFrom[_from]);
    }
    
    function filterList(uint _aadhaar) external view returns(uint[]){
        uint[] memory filtered;
        address _from = userdetails.getAddress(_aadhaar);
        uint count = 0;
        uint[] memory tofilter = permissionFrom[_from];
        for(uint i=0; i<tofilter.length; i++)
        {
            if(permission_list[tofilter[i]].to == msg.sender)
            {
                filtered[count] = tofilter[i];
                count++;
            }
        }
        return(filtered);
    }
    
    function permissionList(uint _id) permission_participants(_id) external view returns(address, address, uint, string, bool){
        return(permission_list[_id].to, permission_list[_id].from, permission_list[_id].recordID, permission_list[_id].masterkey, permission_list[_id].status);
    }

}