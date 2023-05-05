import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig  = {
    apiKey: "AIzaSyCM8BdI7egvtPw4flii275yK4trVCZwg6E",
    authDomain: "reminder-23bd0.firebaseapp.com",
    projectId: "reminder-23bd0",
    storageBucket: "reminder-23bd0.appspot.com",
    messagingSenderId: "386187834889",
    appId: "1:386187834889:web:083186ffbf39e78b046ad8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)