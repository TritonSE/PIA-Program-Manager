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

router.put(
  "/edit",
  [verifyAuthToken],
  ProgressNoteValidator.editProgressNote,
  ProgressNoteController.editProgressNote,
);

router.delete(
  "/delete",
  [verifyAuthToken],
  ProgressNoteValidator.deleteProgressNote,
  ProgressNoteController.deleteProgressNote,
);

router.get("/all", [verifyAuthToken], ProgressNoteController.getAllProgressNotes);

export default router;
