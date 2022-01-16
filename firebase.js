// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjdjPra6hyA27ff5eEZgrHL5rGeVgLnGI",
  authDomain: "poggersgram.firebaseapp.com",
  projectId: "poggersgram",
  storageBucket: "poggersgram.appspot.com",
  messagingSenderId: "58832100467",
  appId: "1:58832100467:web:e6f9f77f4feefe9684de06",
  measurementId: "G-HBRQZP8MSD"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore()
const storage = getStorage()
const analytics = getAnalytics(app);

export {app, db, storage}