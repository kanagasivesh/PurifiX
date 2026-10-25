import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRvJh5yYo-KW9ORjB03OHovTj9aqIU34k",
  authDomain: "purifixro.firebaseapp.com",
  projectId: "purifixro",
  storageBucket: "purifixro.firebasestorage.app",
  messagingSenderId: "805367770170",
  appId: "1:805367770170:web:fc4378bdd0b42dbae61903",
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
