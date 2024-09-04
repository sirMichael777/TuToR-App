
import {getApp,getApps,initializeApp} from "firebase/app";
import {getAuth,} from "firebase/auth"
import {getFirestore} from "firebase/firestore";
import {getStorage} from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAEnFmWEh6e9x-8TDUy5tHmP8b13vb6pQY",
    authDomain: "tutor-f5825.firebaseapp.com",
    projectId: "tutor-f5825",
    storageBucket: "tutor-f5825.appspot.com",
    messagingSenderId: "473253658607",
    appId: "1:473253658607:web:8fec7e30354f7252df801a"
};

const app = getApps.length>0? getApp() : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app)
const firestoreDB = getFirestore(app)
const firebaseStorage = getStorage(app);

export { firebaseAuth, firestoreDB ,app,firebaseStorage };