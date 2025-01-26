import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCotz6KNapffRwgjDe2jZSMySQ8sS1_1eU",
  appId: "1:912234254299:web:aa2a806de2c9c0b272e1fe",
  authDomain: "scalp-39810.firebaseapp.com",
  databaseURL: "https://scalp-39810-default-rtdb.firebaseio.com",
  messagingSenderId: "912234254299",
  projectId: "scalp-39810",
  storageBucket: "scalp-39810.firebasestorage.app",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
