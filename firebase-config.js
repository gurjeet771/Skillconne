
// firebase-config.js

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { getStorage } from
    "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyDUMo7Fd8ZmobMAYdMAsjysHN-nqtR77aQ",
    authDomain: "skillconnect-eef46.firebaseapp.com",
    projectId: "skillconnect-eef46",
    storageBucket: "skillconnect-eef46.firebasestorage.app",
    messagingSenderId: "304311002066",
    appId: "1:304311002066:web:1877625ff15e4c22a6de0b",
    measurementId: "G-06XEJHG2BM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services for other files
export { app, auth, db, storage };
