/**
 * Calendar route requests
 */
import express from "express";

import * as CalendarController from "../controllers/calendar";
import { verifyAuthToken } from "../validators/auth";
import * as CalendarValidator from "../validators/calendar";

const router = express.Router();

router.get("/:studentId/:programId", [verifyAuthToken], CalendarController.getCalendar);
router.patch(
  "/:studentId/:programId",
  [verifyAuthToken],
  CalendarValidator.editCalendar,
  CalendarController.editCalendar,
);

export default router;
