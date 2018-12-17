pragma solidity 0.4.24;

contract userDetails{
    
    event addressLinked(address user, string name, uint phone, uint aadhar);
    
    struct UserInfo{
        string name;
        uint phone;
        address user;
        string password;
    }
    
    //create mapping between user addresses and types
    mapping(address => string) public accountType;

    //create mapping between user address and user details
    mapping(uint => UserInfo) public userInfo;
    
    //set account type for message sender
    function setType(string _type) public{
        accountType[msg.sender] = _type;
    }
    
    //accept parameters and assign to local structure instance 
    function setInfo(uint _aadhar, string _name, uint _phone, string _password) public{
        require(userInfo[_aadhar].user == 0x0000000000000000000000000000000000000000,"Aadhar Card already exists");
        UserInfo memory info; 
        
        info.name = _name;
        info.phone = _phone;
        info.user = msg.sender;
        info.password = _password;

        //map msg sender to personal info
        userInfo[_aadhar] = info;
        
        //fire event for logging
        emit addressLinked(msg.sender,info.name,info.phone,_aadhar);
    }
    
    function login(uint _aadhar, string _password) external view returns(bool){
        //check if account exists using aadhar no.
        require(userInfo[_aadhar].user != 0x0000000000000000000000000000000000000000,"Account does not exist");
        //check if entered password is correct for given account to login
        return(keccak256(abi.encodePacked(userInfo[_aadhar].password)) == keccak256(abi.encodePacked(_password)));
    }

    //view information of user
    function getInfo(uint _aadhar) external view returns(string, uint, address){
        return (userInfo[_aadhar].name,userInfo[_aadhar].phone,userInfo[_aadhar].user);
    }

    function getAddress(uint _aadhar) external view returns(address){
       return(userInfo[_aadhar].user); 
    }
}
