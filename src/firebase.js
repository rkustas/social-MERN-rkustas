import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyCv1xEEoFVffHLEqYfDjTdMFO8RRBB76WY",
  authDomain: "graphql-react-node-7a6c1.firebaseapp.com",
  projectId: "graphql-react-node-7a6c1",
  storageBucket: "graphql-react-node-7a6c1.appspot.com",
  // messagingSenderId: "244726018971",
  appId: "1:244726018971:web:4d5c7f9763d98fbdce673e",
  measurementId: "G-9MH6CZLDQN",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Exporting authentication from firebase
export const auth = firebase.auth();

// Exporting google authentication for a google login
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
