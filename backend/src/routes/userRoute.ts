import express from "express";

import { createUser } from "../controllers/userController";

const router = express.Router();

router.use(express.json());

router.post("/createUser", createUser);

export default router;
