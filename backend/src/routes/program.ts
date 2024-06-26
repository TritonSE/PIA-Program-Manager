/**
 * Task route requests.
 */

import express from "express"; // { RequestHandler }

import * as ProgramController from "../controllers/program";
import * as ProgramValidator from "../validators/program";

const router = express.Router();

router.patch("/:id", ProgramValidator.updateProgram, ProgramController.updateProgram);
router.post("/create", ProgramValidator.createProgram, ProgramController.createProgram);
router.post("/archive/:id", ProgramController.archiveProgram);
router.get("/all", ProgramController.getAllPrograms);
router.get("/:id", ProgramController.getProgram);
router.get("/enrollments/:id", ProgramController.getProgramEnrollments);

export default router;
