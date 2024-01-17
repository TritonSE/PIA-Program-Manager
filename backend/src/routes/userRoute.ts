
import express, { Request, Response } from "express";
import admin, { ServiceAccount } from "firebase-admin";

import User from "../models/User";


const router = express.Router();

// Initialize Firebase Admin SDK
const serviceAccount = require("../firebase/ServiceAccountKey.json") as ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Use type assertion
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

router.use(express.json());

router.post("/createUser", async (req: Request, res: Response) => {
// router.post("/createUser", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, gender, accountType, approvalStatus, email, password } = req.body;

    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Set custom claim for accountType (“admin” | “team”)
    await admin.auth().setCustomUserClaims(userRecord.uid, { accountType });

    // Create user in MongoDB
    const newUser = new User({
      name,
      gender,
      accountType,
      approvalStatus,
      firebaseUid: userRecord.uid,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
