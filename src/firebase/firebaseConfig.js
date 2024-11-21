// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Authentication SDK

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
const auth = getAuth(app); // Initialize Firebase Authentication

// Export the initialized instances
export { database, auth, analytics };
