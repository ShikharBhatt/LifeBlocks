pragma solidity ^0.4.24;

contract Permissions{
    
    // modifier hasAccess(){
    //     require();
    //     _;
    // }

    struct permission{
        address to;
        address from;
        string ipfsHash;
        string masterkey;
        bool status;
    } 

    permission[] permission_list;

    mapping(address => uint[]) permissionFrom;

    function grant(address _to, string _ipfsHash, string _masterkey) public{
        uint id = permission_list.push(permission(_to,msg.sender,_ipfsHash,_masterkey,true)) -1;
        permissionFrom[msg.sender].push(id);
    }
    
    function revoke(uint _id) public {
        require(permission_list[_id].from == msg.sender, "You are not authorized");
        permission_list[_id].status = false;
    }
    
    function getPermissionList(address _from) external view returns(uint[]){
        return(permissionFrom[_from]);
    }
    
    function permissionList(uint _id) external view returns(address, address, string, string, bool){
        return(permission_list[_id].to, permission_list[_id].from, permission_list[_id].ipfsHash, permission_list[_id].masterkey, permission_list[_id].status);
    }

}
