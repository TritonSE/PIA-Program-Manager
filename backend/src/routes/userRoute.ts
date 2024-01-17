
import express, { Request, Response } from "express";
import admin, { ServiceAccount } from "firebase-admin";

import * as serviceAccount from "../firebase/ServiceAccountKey.json";
import User, { UserDocument } from "../models/User";

// Define the type for req.body
type CreateUserRequestBody = {
  name: string;
  gender: string;
  accountType: "admin" | "team";
  approvalStatus: string; // NOTE Should this be restricted to certain values?
  email: string;
  password: string;
};

const router = express.Router();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount), // Type assertion
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

router.use(express.json());

router.post(
  "/createUser",
  async (
    req: Request<Record<string, never>, Record<string, never>, CreateUserRequestBody>,
    res: Response,
    // ): Promise<void> => {
    ) => {

    try {
      const { name, gender, accountType, approvalStatus, email, password } = req.body;

      // Create user in Firebase
      const userRecord = await admin.auth().createUser({
        email,
        password,
      } as admin.auth.CreateRequest); // Type assertion

      // Set custom claim for accountType (“admin” | “team”)
      await admin.auth().setCustomUserClaims(userRecord.uid, { accountType });

      // Create user in MongoDB
      const newUser = new User({
        name,
        gender,
        accountType,
        approvalStatus,
        firebaseUid: userRecord.uid,
      } as UserDocument); // Type assertion

      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }

    return;
  },
);

export default router;

