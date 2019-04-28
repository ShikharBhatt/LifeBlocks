var crypto = require('crypto');

// function to encrypt given data with randomly generated AES-256 key
export function encrypt(data){
        // generate 32 bytes random master key    
        const masterkey = crypto.randomBytes(32).toString('Base64');
        console.log('masterkey: ' + masterkey);

        // generate random initilization vector
        const iv = crypto.randomBytes(16);
        console.log('iv: ' + iv.toString('base64'));
        
        // generate random salt
        const salt = crypto.randomBytes(64);
        console.log('salt: ' + salt.toString('base64'));
        
        // key generation using 1000 rounds of pbkdf2
        const key = crypto.pbkdf2Sync(masterkey, salt, 1000, 32, 'sha512');
        console.log('key: ' + key.toString('base64'));
        
        // create Cipher instance of AES 256 CBC mode
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // encrpyt given text
        const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
        console.log('encrypted text: ' + encrypted)
        
        //prepend salt and iv to encrypted text
        const output = salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
        console.log('output: ' + output);

        // generate output
        return [masterkey, output];
}

export function decrypt(data, masterkey, callback){
    try{
        //read hex from buffer
        const Data = Buffer.from(data,'hex');
        console.log(Data.toString('utf8'));

        //change encoding from hex to utf8
        const bData = Data.toString('utf8')

        //split retrieved data into salt, iv & encrypted text
        const parts = bData.split(':');
        console.log("parts: " + parts);

        const salt_r = new Buffer(parts[0], 'hex');
        console.log(salt_r.toString('base64'));

        const iv_r = new Buffer(parts[1], 'hex');
        console.log(iv_r.toString('base64'));
        
        const text = parts[2];

        // derive key using pbkdf2
        const key_r = crypto.pbkdf2Sync(masterkey, salt_r , 1000, 32, 'sha512');

        // AES 256 CBC Mode
        const decipher = crypto.createDecipheriv('aes-256-cbc', key_r, iv_r);
    
        // decrypt given text
        const decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    
        //return decrypted;
        callback(decrypted)
    }
    catch(e){
        
    }

    // error
    return null;
}


