/**
 * Task route requests.
 */

import express from "express"; // { RequestHandler }

// import { ParamsDictionary } from "express-serve-static-core";
// import { ParsedQs } from "qs";

import * as ProgramFormController from "../controllers/program-form";
import * as ProgramFormValidator from "../validators/program-form";

const router = express.Router();

//router.get("/:id", ProgramFormController.getForm);
router.post("/", ProgramFormValidator.createForm, ProgramFormController.createForm);
//router.delete("/:id", ProgramFormController.removeForm);

export default router;
