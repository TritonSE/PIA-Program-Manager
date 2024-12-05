/**
 * Calendar route requests
 */
import express from "express";

import * as CalendarController from "../controllers/calendar";
import { verifyAuthToken } from "../validators/auth";

const router = express.Router();

router.get("/all", [verifyAuthToken]);
router.get("/:studentId/:programId", [verifyAuthToken], CalendarController.getCalendar);
router.put("/:studentId/:programId", [verifyAuthToken]);

export default router;
