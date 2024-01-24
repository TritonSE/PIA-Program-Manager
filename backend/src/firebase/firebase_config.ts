import admin, { ServiceAccount } from "firebase-admin";

import { serviceAccountKey } from "../config";

// Initialize Firebase Admin SDK to store user credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as ServiceAccount), // Type assertion
});

// Export firebase auth object to make accessible to other files
export const firebaseAuth = admin.auth();
