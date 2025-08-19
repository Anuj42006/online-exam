// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6eYN2ru2JYOTqno6fp5KTPWxqfgzW8PA",
  authDomain: "online-exam-89fb3.firebaseapp.com",
  projectId: "online-exam-89fb3",
  storageBucket: "online-exam-89fb3.firebasestorage.app",
  messagingSenderId: "801959555374",
  appId: "1:801959555374:web:3fb89fa145e9c846240abf",
  measurementId: "G-M0W0DKPCE8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
