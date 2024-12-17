/**
 * Image route requests.
 */

import express from "express";

import * as ImageController from "../controllers/image";
import { verifyAuthToken } from "../validators/auth";
const router = express.Router();

router.post("/edit", [verifyAuthToken], ImageController.editPhoto);
router.post("/get", [verifyAuthToken], ImageController.getPhoto);

export default router;
