var crypto = require('crypto');

export function encrypt(data){
        // generate 32 bytes random master key    
        const masterkey = crypto.randomBytes(32).toString('Base64');

        // generate random initilization vector
        const iv = crypto.randomBytes(16);

        // generate random salt
        const salt = crypto.randomBytes(64);

        // key geneartion using 1000 rounds of pbkdf2
        const key = crypto.pbkdf2Sync(masterkey, salt, 1000, 32, 'sha512');
        
        // create Cipher instance of AES 256 GCM mode
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // encrpyt given text
        const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

        // extract the auth tag
        //const tag = cipher.getAuthTag();

        // generate output
        return [masterkey, Buffer.concat([salt, iv, encrypted]).toString('base64')];
}

export function decrypt(data, masterkey){
    try{
        // base64 decoding
        const bData = Buffer.from(data, 'base64');
        console.log(bData.toString('base64'));

        // convert data to buffers
        const salt = bData.slice(0, 64);
        console.log('salt: ' + salt);
        const iv = bData.slice(64, 80);
        console.log('iv: ' + iv);
        const text = bData.slice(80);
        console.log('text: '+text.toString('base64'))
    
        // derive key using; 32 byte key length
        const key = crypto.pbkdf2Sync(masterkey, salt , 1000, 32, 'sha512');
        console.log('key: ' + key.toString('base64'));
        // AES 256 GCM Mode
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        //decipher.setAuthTag(tag);
    
        // encrypt the given text
        const decrypted = decipher.update(text, 'base64', 'utf8') + decipher.final('utf8');
    
        return decrypted;
    }
    catch(e){

    }

    // error
    return null;
}


