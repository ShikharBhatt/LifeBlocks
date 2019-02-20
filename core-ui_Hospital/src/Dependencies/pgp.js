import { reject, async } from 'q';
import ipfs from './ipfs'

const openpgp = require('openpgp');
//openpgp.initWorker({ path:'openpgp.worker.js' });

//function to generate keys
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

    ipfs.files.add(buffer, (error, result) => {
        if(error){
            console.log(error)
            return "error"
        }
        let ipfsHash = result[0].hash
        console.log("in add: "+ipfsHash)
        callback(ipfsHash);
    });
}

export const getKeys = async(ipfsHash,callback) => {
    ipfs.cat(ipfsHash,(err, file) => {
        if (err){
              throw err
        }
        console.log("file retrieved: " + file)
        console.log("file type: " + typeof file)
        callback(file)
    })
}

export const keyEncrypt = async(message, key, callback) => {
    let pub = (await openpgp.key.readArmored(key.publicKeyArmored)).keys
    console.log(pub)

    openpgp.encrypt({
        message: openpgp.message.fromText(message),
        publicKeys: pub,
    }).then(ciphertext => {
        console.log(ciphertext.data)
        //return ciphertext.data
        callback(ciphertext.data)
    }).catch(reject)
}

export const keyDecrypt = async(key,enc_message,seedphrase,callback) => {
    const {keys} = await openpgp.key.readArmored(key.privateKeyArmored)
    const privKeyObj = keys[0]
    await privKeyObj.decrypt(seedphrase)


    openpgp.decrypt({
        message: await openpgp.message.readArmored(enc_message),
        privateKeys: privKeyObj
    }).then(plaintext =>{
        console.log(plaintext.data)
        callback(plaintext.data)
    })
}