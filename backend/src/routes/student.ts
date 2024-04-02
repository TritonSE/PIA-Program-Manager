/**
 * Task route requests.
 */

import express from "express";

import * as StudentController from "../controllers/student";
import * as StudentValidator from "../validators/student";

const router = express.Router();

router.post("/create", StudentValidator.createStudent, StudentController.createStudent);
router.put("/edit/:id", StudentValidator.editStudent, StudentController.editStudent);
router.get("/all", StudentController.getAllStudents);

router.get("/all", StudentController.getAllStudents);

export default router;
