import express from "express";

import * as ProgressNoteController from "../controllers/progressNote";
import { verifyAuthToken } from "../validators/auth";
import * as ProgressNoteValidator from "../validators/progressNote";

const router = express.Router();

router.post(
  "/create",
  [verifyAuthToken],
  ProgressNoteValidator.createProgressNote,
  ProgressNoteController.createProgressNote,
);
// router.put("/edit/:id", ProgressNoteValidator.editStudent, ProgressNoteController.editStudent);
// router.get("/all", ProgressNoteController.getAllStudents);

export default router;
