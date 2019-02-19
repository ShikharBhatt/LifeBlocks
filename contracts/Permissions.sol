pragma solidity ^0.4.24;

contract Permissions{

    struct permission{
        address to;
        address from;
        string ipfsHash;
        string masterkey;
        bool status;
    } 

    permission[] public permission_list;

    mapping(uint => address) public permissionFrom;

    mapping(address => uint) public permissionCount;


    function grant(address _from, string _ipfsHash, string _masterkey) public{
        uint id = permission_list.push(permission(msg.sender,_from,_ipfsHash,_masterkey,true));
        permissionFrom[id] = msg.sender;
        permissionCount[msg.sender]++;
        //emit event
    }

    function revoke(uint _id) public {
        permission[_id].status = false;
    }

}