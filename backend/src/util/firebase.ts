/**
 * This file contains the configuration for firebase
 * It exports a firebase auth object which will allow users
 * to access any firebase services. For this project we will use
 * firebase to for authentication.
 */

import * as firebase from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import { serviceAccountKey } from "../config";

/**
 * This will initialize the firebase app to store
 * user credentials
 */

firebase.initializeApp({
  credential: firebase.cert(JSON.parse(serviceAccountKey) as string),
});

const firebaseAuth = getAuth();

export { firebaseAuth };
