pragma solidity ^0.4.24;

import "./Storage.sol";

contract storageInterface{
    function getRecordOwner(uint _id) external view returns(address);
    function getDetails(uint _id) external view returns(string, string, string, uint, string);
}

contract Permissions{
    
    address storageInterfaceAddress = 0xf3f0fac080e7babdc06dc5a2e2f68f36116a31c0;
    storageInterface storage_contract = storageInterface(storageInterfaceAddress);
    
    modifier permission_participants(uint _id){
        require(permission_list[_id].from == msg.sender || permission_list[_id].to == msg.sender,"Invalid operation");
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

    function grant(uint recordID, address _to, string _masterkey, address _owner) public returns(uint){
        require(storage_contract.getRecordOwner(recordID) == _owner,"You do not have sufficient permissions");
        uint id = permission_list.push(permission(_to, _owner, recordID, _masterkey, true)) -1;
        permissionFrom[_owner].push(id);
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
        address _from = userdetails.getAddress(_aadhaar);
        uint count = 0;
        uint[] memory tofilter = permissionFrom[_from];
        for(uint i = 0; i < tofilter.length; i++)
        {
            if(permission_list[tofilter[i]].to == msg.sender && permission_list[tofilter[i]].status == true)
            {
                count++;
            }
        }
        uint[] memory filtered = new uint[](count);
        uint k =0;
        for(uint j = 0; j < tofilter.length; j++)
        {
            if(permission_list[tofilter[j]].to == msg.sender && permission_list[tofilter[j]].status == true)
            {
                filtered[k] = tofilter[j];
                k++;
            }
        }
        return(filtered);
    }
    
    function permissionList(uint _id) permission_participants(_id) external view returns(address, address, uint, string, bool){
        return(permission_list[_id].to, permission_list[_id].from, permission_list[_id].recordID, permission_list[_id].masterkey, permission_list[_id].status);
    }

}