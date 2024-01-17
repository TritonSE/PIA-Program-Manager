import express, { Request, Response } from "express";
import admin from "firebase-admin";

import User from "../models/User";


// Initialize Firebase Admin SDK
const serviceAccount = require("../../firebase/ServiceAccountKey.json"); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

async function createUser(req: Request, res: Response) {
  try {
    const { name, gender, accountType, approvalStatus, email, password } = req.body;

    // Create user in Firebase 
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Create user in MongoDB 
    const newUser = new User({
      name,
      gender,
      accountType,
      approvalStatus,
      firebaseUid: userRecord.uid,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { createUser };