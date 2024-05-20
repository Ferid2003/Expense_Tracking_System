import { getFirestore,collection } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getAnalytics} from "firebase/analytics"
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCixssLEqyGtTf8Z_spcgf48y1X5sUrL9U",
    authDomain: "money-management-ced5e.firebaseapp.com",
    projectId: "money-management-ced5e",
    storageBucket: "money-management-ced5e.appspot.com",
    messagingSenderId: "356888226403",
    appId: "1:356888226403:web:1b621d0933ca9d34286656",
    measurementId: "G-FL729KPVED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const db =  getFirestore(app)
export const usersCollection = collection(db, "users")
export const auth = getAuth(app);
export const storage = getStorage(app);
