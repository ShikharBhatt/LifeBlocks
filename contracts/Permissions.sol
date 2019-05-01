pragma solidity ^0.4.24;

import "./Storage.sol";

contract storageInterface{
    function getRecordOwner(uint _id) external view returns(address);
    function getDetails(uint _id) external view returns(string, string, string, uint, string);
}

contract Permissions{
    
    address storageInterfaceAddress = 0x5559291517fd70189de6e56c0f0e97917c9c4cb6;
    storageInterface storage_contract = storageInterface(storageInterfaceAddress);
    
    modifier recordOwner(uint[] _rid){
        bool flag = true;
        for(uint i=0;i<_rid.length;i++)
        {
            if(storage_contract.getRecordOwner(_rid[i]) == msg.sender){
                flag = false;
                break;
            }
        }
        
        require(flag == true);
            _;
        
    }
    
    modifier permission_participants(uint _pid){
        require(permission_list[_pid].from == msg.sender || permission_list[_pid].to == msg.sender);
        _;
    }

    struct permission{
        address to;
        address from;
        uint[] recordID;
        bool status;
    } 

    permission[] permission_list;

    mapping(address => uint[]) permissionFrom;

    address userDetailsInterfaceAddress = 0x692a70d2e424a56d2c6c27aa97d1a86395877b3a; 
    userDetailsInterface userdetails = userDetailsInterface(userDetailsInterfaceAddress);

    function grant(uint[] recordID, address _to) recordOwner(recordID) public returns(uint){
        uint id = permission_list.push(permission(_to, msg.sender, recordID, true)) -1;
        permissionFrom[msg.sender].push(id);
        return id;
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
    
    function permissionList(uint _id) permission_participants(_id) external view returns(address, address, uint[], bool){
        return(permission_list[_id].to, permission_list[_id].from, permission_list[_id].recordID, permission_list[_id].status);
    }

}