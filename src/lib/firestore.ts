import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsDkQf99Xne-8XryvlDHCzYBkwgVQ2T-c",
  authDomain: "simple-blog-498b6.firebaseapp.com",
  projectId: "simple-blog-498b6",
  storageBucket: "simple-blog-498b6.firebasestorage.app",
  messagingSenderId: "734421960509",
  appId: "1:734421960509:web:2551f29a9eecc3bef42754"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export const db = getFirestore(app);
export {app, auth}
