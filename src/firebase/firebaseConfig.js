import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyBcro5wfjca5EOT-T2T1l4y20pCyILpJmY",
//   authDomain: "test-project-1-45d41.firebaseapp.com",
//   databaseURL: "https://test-project-1-45d41-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "test-project-1-45d41",
//   storageBucket: "test-project-1-45d41.appspot.com",
//   messagingSenderId: "251724958803",
//   appId: "1:251724958803:web:a6ff59c3f9bf9fd460caa6",
//   measurementId: "G-309SN1SR8L"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyD0Tato4-fFHO_EYJAcGgQNQWgaDGbYE1I",
//   authDomain: "temp-monitor-cb625.firebaseapp.com",
//   projectId: "temp-monitor-cb625",
//   storageBucket: "temp-monitor-cb625.appspot.com",
//   messagingSenderId: "687976099619",
//   appId: "1:687976099619:web:9c18008d0aa46bbfe22696",
//   measurementId: "G-JLXTQ3NL78"
// };

const firebaseConfig = {
  apiKey: "AIzaSyD0Tato4-fFHO_EYJAcGgQNQWgaDGbYE1I",
  authDomain: "temp-monitor-cb625.firebaseapp.com",
  databaseURL: "https://temp-monitor-cb625-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "temp-monitor-cb625",
  storageBucket: "temp-monitor-cb625.appspot.com",
  messagingSenderId: "687976099619",
  appId: "1:687976099619:web:a0bb95d155b93df0e22696",
  measurementId: "G-HYY7XQLQ0S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const fbDB = getDatabase(app);
