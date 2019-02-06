import { reject } from 'q';
import ipfs from './ipfs'

const openpgp = require('openpgp');
//openpgp.initWorker({ path:'openpgp.worker.js' });

export const registerkey = async(address,seedphrase,callback) => {
    
    const {privateKeyArmored,publicKeyArmored} = await openpgp.generateKey({
        userIds: [{address}],
        curve: 'p256',
        passphrase: seedphrase
    })

    console.log("private key: "+privateKeyArmored)
    console.log("public key: "+publicKeyArmored)
    const pgpkeys = {privateKeyArmored, publicKeyArmored};
    console.log("pgprivate: "+pgpkeys.privateKeyArmored)
    console.log("pgpublic: "+pgpkeys.publicKeyArmored)    
    console.log("pgpkeys: "+pgpkeys)
    let test = JSON.stringify(pgpkeys);
    console.log("test: "+test)
    var buffer = Buffer(test)
    console.log("Buffer: "+buffer)

    //let ipfsHash;
    ipfs.files.add(buffer, (error, result) => {
        if(error){
            console.log(error)
            return "error"
        }
        let ipfsHash = result[0].hash
        console.log("in add: "+ipfsHash)
        //return ipfsHash
        callback(ipfsHash);
    });
    //console.log("out add: "+ipfsHash);
    //return ipfsHash;
}

// function getkeys(address) {
    //const ipfsHash = //get ipfshash from smart contract
    // const pgpkeys = ipfs.cat(ipfsHash);
    // return pgpkeys;
// }

// export function key_encrypt(message, address){
//     const key = getkeys(address);

//     if(!key){
//         return Error("Key does not exist for this address");
//     }

//     return openpgp.encrypt({
//         message: openpgp.message.fromText(message),
//         publicKeys: (openpgp.key.readArmored(key.public)).keys,
//     }).then(ciphertext => {
//         return ciphertext.data
//     }).catch(reject)
// }

//not complete
//export function key_decrypt(){}