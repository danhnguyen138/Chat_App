import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

// powershell -ExecutionPolicy Bypass -Command "firebase init" 
// powershell -ExecutionPolicy Bypass -Command "firebase emulators:start"
const firebaseConfig = {
    apiKey: "AIzaSyBNX036QY-15TR0JjF7QdbTD8dgUdp0nwI",
    authDomain: "chat-app-c7719.firebaseapp.com",
    projectId: "chat-app-c7719",
    storageBucket: "chat-app-c7719.appspot.com",
    messagingSenderId: "850011783816",
    appId: "1:850011783816:web:9394fb89513de8aab9d53d",
    measurementId: "G-FTYMWLBX4C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


const auth = firebase.auth();
const db = firebase.firestore();


auth.useEmulator('http://localhost:9099');
if (window.location.hostname == 'localhost') {
    db.useEmulator('localhost', '8080');
}



export { db, auth };
export default firebase;
