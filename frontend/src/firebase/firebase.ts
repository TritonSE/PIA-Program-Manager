import dotenv from "dotenv";
import { FirebaseOptions, initializeApp } from "firebase/app";
// import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
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

/*
 * Function does not work properly, should be in the server side
 */
// const checkEmailExists = async (email: string) => {
//   try {
//     const methods = await fetchSignInMethodsForEmail(auth, email);
//     return methods && methods.length > 0;
//   } catch (error) {
//     console.error("Error checking if email exists: ", error);
//     return false;
//   }
// };

// const checkEmailExists = async (email: string) => {
//   console.log("Entered checkEmailExists function");
//   try {
//     console.log("Entering try block in checkEmailExists function");
//     const methods = await fetchSignInMethodsForEmail(auth, email);
//     return methods && methods.length > 0;
//   } catch (error: any) {
//     console.log("Entering catch block in checkEmailExists function");
//   // } catch (error) {
//     if (error.code === 'auth/email-already-exists') {
//       console.log(`Email ${email} already exists.`);
//       return true;
//     } else {
//       console.error("Error checking if email exists: ", error);
//       return false;
//     }
//   }
// };

// export { app, auth, checkEmailExists };

export { app, auth };
