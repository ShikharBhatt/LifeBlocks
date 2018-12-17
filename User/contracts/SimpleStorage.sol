pragma solidity 0.4.24;

contract SimpleStorage {
	string ipfsHash;
	address addr;
 
  	mapping (address => string) setHash;

  	function set(string x) public {
    	ipfsHash = x;
    }

  function get() public view returns (string) {
    return ipfsHash;
  }

  function sendHash(string ipfs,address tosend) public{	  
    setHash[tosend] = ipfs;
  }

  function getHash(address getter)public view returns (string){
   // require(msg.sender == getter, "Accessing incorrect Address");
	return (setHash[getter]);
 
  }
}
