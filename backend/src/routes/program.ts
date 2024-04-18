/**
 * Task route requests.
 */

import express from "express"; // { RequestHandler }

import * as ProgramController from "../controllers/program";
import * as ProgramValidator from "../validators/program";

const router = express.Router();

router.post("/", ProgramValidator.createProgram, ProgramController.createProgram);

export default router;
