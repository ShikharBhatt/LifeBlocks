import { reject } from 'q';
import ipfs from './ipfs'

const openpgp = require('openpgp');
//openpgp.initWorker({ path:'openpgp.worker.js' });

export function registerkey(address,seedphrase) {
    const {privateKeyArmored, publicKeyArmored} = openpgp.generateKey({
        userIds: [{address}],
        curve: 'p256',
        passphrase: seedphrase
    })

    const pgpkeys = {privateKeyArmored, publicKeyArmored};

    const ipfsHash = ipfs.add(JSON.stringify(pgpkeys));

    return ipfsHash;
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