// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA422uRebdhC4twLvfAremNTzdd08n5h8s",
  authDomain: "owuragram.firebaseapp.com",
  projectId: "owuragram",
  storageBucket: "owuragram.appspot.com",
  messagingSenderId: "932905774030",
  appId: "1:932905774030:web:3003193ad1e7807976199f",
  measurementId: "G-PDT917VG89"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export default firebase;
