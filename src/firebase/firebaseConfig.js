// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcYvQeoXm9XIMIVlspVi-CvzoLwsKcARU",
  authDomain: "peopleconnect-aaf57.firebaseapp.com",
  databaseURL: "https://peopleconnect-aaf57-default-rtdb.firebaseio.com",
  projectId: "peopleconnect-aaf57",
  storageBucket: "peopleconnect-aaf57.appspot.com",
  messagingSenderId: "252587270466",
  appId: "1:252587270466:web:f597e239277828466a28db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Initialize Realtime Database

export { database };