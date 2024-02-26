/**
 * Task route requests.
 */

import express from "express";

import * as StudentController from "../controllers/student";
import * as StudentValidator from "../validators/student";

const router = express.Router();

router.post("/", StudentValidator.createStudent, StudentController.createStudent);

router.get("/all", StudentController.getAllStudents);

export default router;
