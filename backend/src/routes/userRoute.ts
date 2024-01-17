import express, { Request, Response } from 'express';
import User from '../models/User'; 
import admin from 'firebase-admin';
import path from 'path';

const router = express.Router();

// Initialize Firebase Admin SDK 
const serviceAccountPath = path.resolve(__dirname, '../../firebase/fb_service_account_key.json'); 
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

router.use(express.json());

router.post('/api/createUser', async (req: Request, res: Response) => {
  try {
    const { name, gender, accountType, approvalStatus, email, password } = req.body;

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Create user in MongoDB with additional details
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
});

export default router;
