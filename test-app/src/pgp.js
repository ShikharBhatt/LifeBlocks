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

export const getkeys = async(ipfsHash,callback) => {
    ipfs.cat(ipfsHash,(err, file) => {
        if (err){
              throw err
        }
        console.log("file retrieved: " + file)
        console.log("file type: " + typeof file)
        callback(file)
    })
}

export const key_encrypt = async(message, ipfsHash) => {
    getkeys(ipfsHash,function(key){
        
        if(!key){
            return Error("Key does not exist for this address");
        }

        const pub = (await openpgp.key.readArmored(key.public)).keys

        return openpgp.encrypt({
            message: openpgp.message.fromText(message),
            publicKeys: pub,
        }).then(ciphertext => {
            return ciphertext.data
        }).catch(reject)
    });
}

export const key_decrypt = async(enc_message,seedphrase,ipfsHash) => {
    getkeys(ipfsHash,function(key){
        
        if(!key){
            return Error("Key does not exist for this address");
        }

        const { keys } = await openpgp.key.readArmored(walletKey.private)
        
        const privKeyObj = keys[0]
        
        await privKeyObj.decrypt(seedphrase)
        
        openpgp.decrypt({
            message: await openpgp.message.readArmored(enc_message),
            privateKeys: [privKeyObj],
        }).then(plaintext => {
            return plaintext.data
        })
    });
}