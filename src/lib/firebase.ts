import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAsDkQf99Xne-8XryvlDHCzYBkwgVQ2T-c",
  authDomain: "simple-blog-498b6.firebaseapp.com",
  projectId: "simple-blog-498b6",
  storageBucket: "simple-blog-498b6.firebasestorage.app",
  messagingSenderId: "734421960509",
  appId: "1:734421960509:web:e6a80a636f85a713f42754"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getDatabase(app);