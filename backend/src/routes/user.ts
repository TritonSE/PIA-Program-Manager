import express from "express";

import * as UserController from "../controllers/user";
import * as UserValidator from "../validators/user";

const router = express.Router();

router.use(express.json());

router.post("/", UserValidator.createUser, UserController.createUser);

export { router as userRouter };
