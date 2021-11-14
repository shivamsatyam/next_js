// Import the functions you need from the SDKs you need

import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// shivam-signal satyamdeveloper2887@gmail.com
const firebaseConfig = {
  apiKey: "AIzaSyCc0bkXk3aiSdLyi4b43vl1qHctO77nqa8",
  authDomain: "shivam-snap-clone.firebaseapp.com",
  projectId: "shivam-snap-clone",
  storageBucket: "shivam-snap-clone.appspot.com",
  messagingSenderId: "324362480687",
  appId: "1:324362480687:web:b993decbce7f0a6f222ada",
  measurementId: "G-H9WG1XGFME"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };



