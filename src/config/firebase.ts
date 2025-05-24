import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJaa-RQlRNwszFPjpq6Edot2cZikBRLcs",
  authDomain: "velocityafric.firebaseapp.com",
  projectId: "velocityafric",
  storageBucket: "velocityafric.firebasestorage.app",
  messagingSenderId: "607004602870",
  appId: "1:607004602870:web:998e2500672031cf9117d7",
  measurementId: "G-ZCJZYHV4WD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
