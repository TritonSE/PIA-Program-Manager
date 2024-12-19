/**
 * Student route requests.
 */

import express from "express";

import * as StudentController from "../controllers/student";
import { verifyAuthToken } from "../validators/auth";
import * as StudentValidator from "../validators/student";
const router = express.Router();

router.post(
  "/create",
  [verifyAuthToken],
  StudentValidator.createStudent,
  StudentController.createStudent,
);
router.put(
  "/edit/:id",
  [verifyAuthToken],
  ...StudentValidator.editStudent,
  StudentController.editStudent,
);
router.get("/all", [verifyAuthToken], StudentController.getAllStudents);
router.get("/:id", [verifyAuthToken], StudentController.getStudent);
router.delete("/:id", [verifyAuthToken], StudentController.deleteStudent);

export default router;
