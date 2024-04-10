import { Request, Response } from "express";
// import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";

import { firebaseAdminAuth } from "../util/firebase";

// Function to check if email exists
export const checkEmailExists = async (req: Request, res: Response) => {
  const { email } = req.body;

  console.log("In checkEmailExists function in controllers/email");

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const userRecord = await firebaseAdminAuth.getUserByEmail(email);

    console.log("(In controllers/email) Email already exists");
    console.log("userRecord", userRecord);

    return res.status(200).json({ exists: true, message: "Email already exists" });
  } catch (error) {
    // error thrown, email does not exist
    return res.status(200).json({ exists: false, message: "Email does not exist" });
  }
};
