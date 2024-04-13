/**
 * Task route requests.
 */

import express from "express"; // { RequestHandler }

import * as ProgramController from "../controllers/program";
import * as ProgramValidator from "../validators/program";

const router = express.Router();

router.post("/create", ProgramValidator.createForm, ProgramController.createForm);
router.get("/all", ProgramController.getAllPrograms);

export default router;
