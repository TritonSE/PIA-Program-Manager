/**
 * Task route requests.
 */

import express from "express";

import * as SessionController from "../controllers/session";
import { verifyAuthToken } from "../validators/auth";
import * as SessionValidator from "../validators/session";

const router = express.Router();

router.get("/get", [verifyAuthToken], SessionController.getRecentSessions);
router.get("/getAbsences", [verifyAuthToken], SessionController.getAbsenceSessions);
router.patch(
  "/mark",
  [verifyAuthToken],
  SessionValidator.updateSession,
  SessionController.updateSession,
);
router.post(
  "/markAbsence",
  [verifyAuthToken],
  SessionValidator.absenceSession,
  SessionController.createAbsenceSession,
);

export default router;
