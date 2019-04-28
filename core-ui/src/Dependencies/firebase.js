import * as firebase from 'firebase';

//define config for firebase instance
const config = {
    apiKey: "AIzaSyAKFfHgewDLrGJ7lNxow7Bv8EsQYlvppYY",
    authDomain: "lifeblocks-426b3.firebaseapp.com" ,
    databaseURL: "https://lifeblocks-426b3.firebaseio.com",
    projectId: "lifeblocks-426b3",
    storageBucket: "lifeblocks-426b3.appspot.com",
    messagingSenderId: "243586073401",
};

export const firebaseApp = firebase.initializeApp(config)