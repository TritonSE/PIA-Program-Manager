import express from "express";

import * as UserController from "../controllers/user";
import { verifyAuthToken } from "../validators/auth";
import * as UserValidator from "../validators/user";

const router = express.Router();

router.use(express.json());

router.post("/create", UserValidator.createUser, UserController.createUser);
router.get("/", [verifyAuthToken], UserController.loginUser);

export default router;
