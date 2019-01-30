import { reject } from 'q';

const openpgp = require('openpgp');
openpgp.initWorker({ path:'openpgp.worker.js' });

export function registerkey(address,seedphrase) {
    const {privateKeyArmored, publicKeyArmored} = await openpgp.generateKey({
        userIds: [{address}],
        curve: p256,
        passphrase: seedphrase
    })

    const pgpkeys = {privateKeyArmored, publicKeyArmored};

    const ipfsHash = await ipfs.add(JSON.stringify(pgpkeys));

    //add transaction or return ipfshash
}

function getkeys(address) {
    //const ipfsHash = //get ipfshash from smart contract
    const pgpkeys = await ipfs.cat(ipfsHash);
    return pgpkeys;
}

export function key_encrypt(message, address){
    const key = getkeys(address);

    if(!key){
        return Error("Key does not exist for this address");
    }

    return openpgp.encrypt({
        message: openpgp.message.fromText(message),
        publicKeys: (await openpgp.key.readArmored(key.public)).keys,
    }).then(ciphertext => {
        return ciphertext.data
    }).catch(reject)
}

//not complete
//export function key_decrypt(){}