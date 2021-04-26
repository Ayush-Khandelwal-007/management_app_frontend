import firebase from "firebase/";

const firebaseConfig = {
    apiKey: "AIzaSyAd1u1s6LqjGLTXAt7qoirrh3R4ezl6auc",
    authDomain: "easymanage-f7634.firebaseapp.com",
    projectId: "easymanage-f7634",
    storageBucket: "easymanage-f7634.appspot.com",
    messagingSenderId: "1026432861646",
    appId: "1:1026432861646:web:3c9acada9c3c800a70d79f",
    measurementId: "G-LT0B8HKK4W"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage };