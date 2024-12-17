/**
 * Task route requests.
 */

import express from "express"; // { RequestHandler }

import * as ProgramController from "../controllers/program";
import { verifyAuthToken } from "../validators/auth";
import * as ProgramValidator from "../validators/program";

const router = express.Router();

router.patch(
  "/:id",
  [verifyAuthToken],
  ProgramValidator.updateProgram,
  ProgramController.updateProgram,
);
router.post(
  "/create",
  [verifyAuthToken],
  ProgramValidator.createProgram,
  ProgramController.createProgram,
);
router.post("/archive/:id", [verifyAuthToken], ProgramController.archiveProgram);
router.get("/all", [verifyAuthToken], ProgramController.getAllPrograms);
router.get("/:id", [verifyAuthToken], ProgramController.getProgram);
router.get("/enrollments/:id", [verifyAuthToken], ProgramController.getProgramEnrollments);

export default router;
