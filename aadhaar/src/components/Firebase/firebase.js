import app from 'firebase/app';
import 'firebase/auth';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase{
    constructor(){
        app.initializeApp(config);

        this.auth = app.auth();
    }

    getPhone = (aadhaar) => {
        var ref = app.database.ref('uidai');
        ref.child('uidai').orderByChild('aadhaar_no').equalTo(aadhaar).on("value", function(snapshot) {
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
