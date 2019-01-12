import app from 'firebase/app';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAKFfHgewDLrGJ7lNxow7Bv8EsQYlvppYY",
    authDomain: "lifeblocks-426b3.firebaseapp.com" ,
    databaseURL: "https://lifeblocks-426b3.firebaseio.com",
    projectId: "lifeblocks-426b3",
    storageBucket: "lifeblocks-426b3.appspot.com",
    messagingSenderId: "243586073401",
};

class Firebase{
    constructor(){
        app.initializeApp(config);

        this.auth = app.auth();
    }

    getPhone = (aadhaar) => {
        alert("Aadhaar" + aadhaar)
        var ref = app.database.ref('uidai');
        ref.orderByChild('aadhaar_no').equalTo(aadhaar).on("value", function(snapshot) {
            console.log(snapshot.val());
        });
    }

    doLinkAadhaar = (phone, appVerifier) => 
      this.auth.signInWithPhoneNumber(phone, appVerifier);

    doSignInWithOTP = (phone, appVerifier) =>
        this.auth.signInWithPhoneNumber(phone, appVerifier);

    doSignOut = () => 
        this.auth.SignOut();

}

export default Firebase;
