import express from "express";

import * as UserController from "../controllers/user";
import { verifyAuthToken } from "../validators/auth";
import * as UserValidator from "../validators/user";

const router = express.Router();

router.use(express.json());

router.post("/create", UserValidator.createUser, UserController.createUser);

router.post("/approve", [verifyAuthToken], UserController.approveUser);

router.post("/deny", [verifyAuthToken], UserController.denyUser);

router.delete("/delete/:email", [verifyAuthToken], UserController.deleteUser);

router.get("/not-approved", [verifyAuthToken], UserController.getNotApprovedUsers);

router.get("/", [verifyAuthToken], UserController.loginUser);
router.patch("/editName", [verifyAuthToken], UserValidator.editName, UserController.editName);
router.patch("/editEmail", [verifyAuthToken], UserValidator.editEmail, UserController.editEmail);
router.patch(
  "/editLastChangedPassword",
  [verifyAuthToken],
  UserValidator.editLastChangedPassword,
  UserController.editLastChangedPassword,
);
router.get("/getAllTeamAccounts", [verifyAuthToken], UserController.getAllTeamAccounts);
router.patch(
  "/editAccountType",
  [verifyAuthToken],
  UserValidator.editAccountType,
  UserController.editAccountType,
);
router.patch(
  "/editArchiveStatus",
  [verifyAuthToken],
  UserValidator.editArchiveStatus,
  UserController.editArchiveStatus,
);

export default router;
