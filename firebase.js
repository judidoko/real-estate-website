// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyAEQGtuaRpKNMToqZcDrjZsITCkukexFlA",
  apiKey: `${import.meta.env.VITE_KEY}`,
  authDomain: "real-estate-project-dccf7.firebaseapp.com",
  projectId: "real-estate-project-dccf7",
  storageBucket: "real-estate-project-dccf7.appspot.com",
  messagingSenderId: "220538223975",
  appId: "1:220538223975:web:4d6a4990df31abeb7a03c2",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
