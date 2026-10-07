// =========================================================
// SKILLCONNECT - FIREBASE CONFIGURATION
// =========================================================

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

// Firebase Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Firebase Firestore Database
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Firebase Storage
import { getStorage } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";


// =========================================================
// 1. FIREBASE CONFIGURATION
// =========================================================
//
// IMPORTANT:
// Replace the values below with the Firebase configuration
// from your own Firebase project.
//
// Firebase Console:
// https://console.firebase.google.com/
//
// Project Settings
// → General
// → Your apps
// → Web app
// → SDK setup and configuration
// → Config
// =========================================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// =========================================================
// 2. INITIALIZE FIREBASE
// =========================================================

const app = initializeApp(firebaseConfig);


// =========================================================
// 3. INITIALIZE FIREBASE SERVICES
// =========================================================

// Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

// Firebase Storage
const storage = getStorage(app);


// =========================================================
// 4. EXPORT SERVICES
// =========================================================
//
// Other JavaScript files can import these like:
//
// import { auth, db } from "./firebase-config.js";
//
// =========================================================

export {
    app,
    auth,
    db,
    storage
};


// =========================================================
// 5. OPTIONAL DEBUG MESSAGE
// =========================================================

console.log("SkillConnect Firebase initialized successfully.");