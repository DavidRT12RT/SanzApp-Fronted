// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwjFYJKbQUEbO3V5NqBoNlsfS0VUUQk3Y",
    authDomain: "react-app-redux-curso-76449.firebaseapp.com",
    projectId: "react-app-redux-curso-76449",
    storageBucket: "react-app-redux-curso-76449.appspot.com",
    messagingSenderId: "544064613071",
    appId: "1:544064613071:web:a6c107a733fef0e175e5ba",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Database
const db = firebase.firestore();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { db, googleAuthProvider, firebase };
