var crypto = require('crypto');

function encrypt(data){
    try{
        // generate 32 bytes random master key    
        const masterkey = crypto.randomBytes(32).toString('Base64');

        // generate random initilization vector
        const iv = crypto.randomBytes(16);

        // generate random salt
        const salt = crypto.randomBytes(64);

        // key geneartion using 1000 rounds of pbkdf2
        const key = crypto.pbkdf2Sync(masterkey, salt, 1000, 32, 'sha512');
        
        // create Cipher instance of AES 256 GCM mode
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        // encrpyt given text
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

        // extract the auth tag
        const tag = cipher.getAuthTag();

        // generate output
        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');

    }

    catch(e){

    }

    // error
    return null;
}

function decrypt(data, masterkey){
    try{
        // base64 decoding
        const bData = Buffer.from(encdata, 'base64');

        // convert data to buffers
        const salt = bData.slice(0, 64);
        const iv = bData.slice(64, 80);
        const tag = bData.slice(80, 96);
        const text = bData.slice(96);
    
        // derive key using; 32 byte key length
        const key = crypto.pbkdf2Sync(masterkey, salt , 1000, 32, 'sha512');

        // AES 256 GCM Mode
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
    
        // encrypt the given text
        const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
    
        return decrypted;
    }
    catch(e){

    }

    // error
    return null;
}


export default crypt;