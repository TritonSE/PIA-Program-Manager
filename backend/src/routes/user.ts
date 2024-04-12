import express from "express";

import * as UserController from "../controllers/user";
import { verifyAuthToken } from "../validators/auth";
import * as UserValidator from "../validators/user";

const router = express.Router();

router.use(express.json());

router.post("/create", UserValidator.createUser, UserController.createUser);
router.get("/", [verifyAuthToken], UserController.loginUser);
router.post("/editPhoto", [verifyAuthToken], UserValidator.editPhoto, UserController.editPhoto);
router.get("/getPhoto/:id", UserValidator.getPhoto, UserController.getPhoto);
router.patch("/editName", UserValidator.editName, UserController.editName);
router.patch("/editEmail", UserValidator.editEmail, UserController.editEmail);
router.patch(
  "/editLastChangedPassword",
  UserValidator.editLastChangedPassword,
  UserController.editLastChangedPassword,
);

export default router;
