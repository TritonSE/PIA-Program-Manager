import express from "express";

import * as UserController from "../controllers/user";
import * as UserValidator from "../validators/user";

const router = express.Router();

router.use(express.json());

router.post("/login", UserValidator.loginUser, UserController.loginUser);
router.post("/", UserValidator.createUser, UserController.createUser);

export default router;
