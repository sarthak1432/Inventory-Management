import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgT2LhSyS-KjvdqDkeGUxyIsqniYeaZZ0",
  authDomain: "inventory-management-b8b02.firebaseapp.com",
  projectId: "inventory-management-b8b02",
  storageBucket: "inventory-management-b8b02.firebasestorage.app",
  messagingSenderId: "789101781880",
  appId: "1:789101781880:web:1fa9f35260e15a76f2de8d",
  measurementId: "G-QYHPQ6HMY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);
