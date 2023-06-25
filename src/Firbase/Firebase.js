// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC68wJeL3QSTc7KAB0b8MA7LBD-gjIjf8",
  authDomain: "e-buy-a29f0.firebaseapp.com",
  projectId: "e-buy-a29f0",
  storageBucket: "e-buy-a29f0.appspot.com",
  messagingSenderId: "93192767281",
  appId: "1:93192767281:web:737b00b6d3ffd6822d5210"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export default db;
export {auth};