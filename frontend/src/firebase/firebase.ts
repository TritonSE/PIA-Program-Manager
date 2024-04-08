import dotenv from "dotenv";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

dotenv.config();

export const initFirebase = () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    throw new Error("Firebase configuration not found.");
  }

  const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) as FirebaseOptions;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  return { app, auth };
};

const { app, auth } = initFirebase();

export { app, auth };
