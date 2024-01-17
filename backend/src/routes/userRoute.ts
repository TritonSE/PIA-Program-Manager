// userRoute.ts
import express, { Request, Response } from 'express';
import User from '../models/User'; // Adjust the path based on your project structure
import admin from 'firebase-admin';

const router = express.Router();

router.use(express.json());

router.post('/api/createUser', async (req: Request, res: Response) => {
  try {
    const { name, gender, accountType, approvalStatus } = req.body;

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
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
