import dotenv from "dotenv";
import { FirebaseOptions, initializeApp } from "firebase/app";
// import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

dotenv.config();

export const initFirebase = () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    throw new Error("Firebase configuration not found.");
  }

  const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) as FirebaseOptions;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const storage = getStorage(app);

  return { app, auth, storage };
};

const { app, auth, storage } = initFirebase();

// const checkEmailExists = async (email: string) => {
//   try {
//     const methods = await fetchSignInMethodsForEmail(auth, email);
//     return methods && methods.length > 0;
//   } catch (error) {
//     console.error("Error checking if email exists: ", error);
//     return false;
//   }
// };

// export { app, auth, checkEmailExists };
export { app, auth, storage };
