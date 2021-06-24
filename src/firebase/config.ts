import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenedrId,
  appId: process.env.REACT_APP_appId,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
const functions = firebase.functions();
export const storageRef = firebase.storage().ref();
export const db = firebase.firestore();
functions.useEmulator("localhost", 5001);

export { firebase, functions };
