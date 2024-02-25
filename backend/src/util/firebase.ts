/**
 * This file contains the configuration for firebase
 * It exports a firebase auth object which will allow users
 * to access any firebase services. For this project we will use
 * firebase to for authentication.
 */

import * as firebase from "firebase/app";
import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import * as firebaseAdmin from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

import { firebaseConfig, serviceAccountKey } from "../config";

/**
 * This will initialize the firebase app to store
 * user credentials
 */

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.cert(JSON.parse(serviceAccountKey) as string),
});

const firebaseApp = firebase.initializeApp(JSON.parse(firebaseConfig) as object);

const firebaseAdminAuth = getAdminAuth();
const firebaseAuth = getAuth(firebaseApp);

const checkEmailExists = async (email: string) => {
  try {
    const methods = await fetchSignInMethodsForEmail(firebaseAuth, email);

    return methods && methods.length > 0;
  } catch (error) {
    console.error("Error checking if email exists: ", error);
    return false;
  }
};

export { firebaseAdminAuth, firebaseAuth, checkEmailExists };
