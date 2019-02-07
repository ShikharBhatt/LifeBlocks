import {key_encrypt} from './pgp';
import { async } from 'q';

var crypto = require('crypto');

export const encrypt= async(data, ipfsHash) => {
        // generate 32 bytes random master key    
        const masterkey = crypto.randomBytes(32).toString('Base64');
        console.log('masterkey: ' + masterkey);

        // generate random initilization vector
        const iv = crypto.randomBytes(16);
        console.log('iv: ' + iv.toString('base64'));
        // generate random salt
        const salt = crypto.randomBytes(64);
        console.log('salt: ' + salt.toString('base64'));
        // key geneartion using 1000 rounds of pbkdf2
        const key = crypto.pbkdf2Sync(masterkey, salt, 1000, 32, 'sha512');
        console.log('key: ' + key.toString('base64'));
        // create Cipher instance of AES 256 CBC mode
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // encrpyt given text
        const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
        console.log('encrypted text: ' + encrypted)
        const output = salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
        console.log('output: ' + output);

        const aes_key = await key_encrypt(masterkey,ipfsHash);

        // generate output
        return [aes_key, output];
}

export function decrypt(data, masterkey){
        // base64 decoding
        console.log(typeof data);
        const bData = Buffer.from(data, 'hex');
        const bString = bData.toString();
        console.log("hopefully hex: "+bData);
        console.log("bString: "+bString); 

        const parts = bString.split(':');
        console.log("parts: " + parts);

        const salt_r = new Buffer(parts[0], 'hex');
        console.log(salt_r.toString('base64'));

        const iv_r = new Buffer(parts[1], 'hex');
        console.log(iv_r.toString('base64'));
        
        const text = parts[2];
        console.log("text: "+text);
        // derive key using; 32 byte key length
        const key_r = crypto.pbkdf2Sync(masterkey, salt_r , 1000, 32, 'sha512');

        // AES 256 GCM Mode
        const decipher = crypto.createDecipheriv('aes-256-cbc', key_r, iv_r);
        //decipher.setAuthTag(tag);
    
        // encrypt the given text
        const decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    
        return decrypted;
}


