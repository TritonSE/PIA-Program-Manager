import express from "express";

import * as UserController from "../controllers/user";
import { verifyAuthToken } from "../validators/auth";
import * as UserValidator from "../validators/user";

const router = express.Router();

router.use(express.json());

router.post("/create", UserValidator.createUser, UserController.createUser);
router.post("/approve", [verifyAuthToken], UserController.approveUser);
router.post("/deny", [verifyAuthToken], UserController.denyUser);
router.get("/", [verifyAuthToken], UserController.loginUser);
router.post("/editPhoto", [verifyAuthToken], UserValidator.editPhoto, UserController.editPhoto);
router.get("/getPhoto/:id", [verifyAuthToken], UserController.getPhoto);
router.patch("/editName", [verifyAuthToken], UserValidator.editName, UserController.editName);
router.patch("/editEmail", [verifyAuthToken], UserValidator.editEmail, UserController.editEmail);
router.patch(
  "/editLastChangedPassword",
  [verifyAuthToken],
  UserValidator.editLastChangedPassword,
  UserController.editLastChangedPassword,
);

export default router;
