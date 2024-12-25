// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-e50a3.firebaseapp.com",
  projectId: "mern-real-estate-e50a3",
  storageBucket: "mern-real-estate-e50a3.firebasestorage.app",
  messagingSenderId: "624946685284",
  appId: "1:624946685284:web:b2ed09de964c00a58c0671",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
