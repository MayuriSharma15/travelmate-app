import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD6Oz7Ysm2n0bMz-2D_BYpxPKlg_-Ps69g",
  authDomain: "travelmate-ai-travelplanner.firebaseapp.com",
  projectId: "travelmate-ai-travelplanner",
  storageBucket: "travelmate-ai-travelplanner.appspot.com",
  messagingSenderId: "602175518837",
  appId: "1:602175518837:web:a0f14a4b98bf4625e0a03c",
};

const app = initializeApp(firebaseConfig);

// ✅ THIS is correct for Expo
export const auth = getAuth(app);
export const db = getFirestore(app);
