import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

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

// Initialize database structure if empty
const rootRef = ref(db, 'compusophy');
const snapshot = await get(rootRef);

if (!snapshot.exists()) {
  // Initialize with empty but valid structure
  await set(rootRef, {
    users: {
      // Empty users object, will be populated as users interact
      _initialized: true // marker to show structure exists
    }
  });
}

// Test database connection and structure
export async function testDatabaseConnection(): Promise<boolean> {
  const testData = {
    token: "test_token",
    url: "https://test.url",
  };

  // Write test to the new structure
  const testRef = ref(db, 'compusophy/users/test/notifications');
  
  try {
    await set(testRef, testData);
    const testSnapshot = await get(testRef);
    return testSnapshot.exists();
  } catch {
    throw new Error("Database connection test failed");
  }
}
