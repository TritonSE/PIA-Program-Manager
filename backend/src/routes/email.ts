import express from "express";

import { checkEmailExists } from "../controllers/email";

const router = express.Router();

// Route to check if email exists
router.post("/check-email", checkEmailExists);

export default router;
