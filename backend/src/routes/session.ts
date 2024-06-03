/**
 * Task route requests.
 */

import express from "express";

import * as SessionController from "../controllers/session";

const router = express.Router();

router.get("/get", SessionController.getRecentSessions);

export default router;
