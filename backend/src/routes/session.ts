/**
 * Task route requests.
 */

import express from "express";

import * as SessionController from "../controllers/session";
import * as SessionValidator from "../validators/session";

const router = express.Router();

router.get("/get", SessionController.getRecentSessions);
router.get("/getAbsences", SessionController.getAbsenceSessions);
router.patch("/mark", SessionValidator.updateSession, SessionController.updateSession);
router.post(
  "/markAbsence",
  SessionValidator.absenceSession,
  SessionController.createAbsenceSession,
);

export default router;
