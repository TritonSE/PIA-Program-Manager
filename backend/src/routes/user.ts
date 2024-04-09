import express from "express";
import multer from "multer";

import * as UserController from "../controllers/user";
import { verifyAuthToken } from "../validators/auth";
import * as UserValidator from "../validators/user";

const router = express.Router();
const upload = multer();

router.use(express.json());

router.post("/create", UserValidator.createUser, UserController.createUser);
router.get("/", [verifyAuthToken], UserController.loginUser);
router.post(
  "/editPhoto",
  upload.single("image"),
  UserValidator.editPhoto,
  UserController.editPhoto,
);
router.get("/getPhoto/:id", UserController.getPhoto);

export default router;
