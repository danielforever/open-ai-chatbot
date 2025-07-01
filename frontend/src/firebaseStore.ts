// Import the functions you need from the SDKs you need
import { FirebaseAdapterConfig } from "@next-auth/firebase-adapter";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
// learn https://firebase.google.com/docs/firestore/quickstart#web-version-9

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQFF79UsaMyUWnX9dipWMXOT_GLUKLhz8",
  authDomain: "chatgpt-messenger-22a0c.firebaseapp.com",
  projectId: "chatgpt-messenger-22a0c",
  storageBucket: "chatgpt-messenger-22a0c.appspot.com",
  messagingSenderId: "201538979868",
  appId: "1:201538979868:web:a1c45ca056051ce48ab7d9",
};

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };


// Initialize Firebase
// singleton pattern
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
