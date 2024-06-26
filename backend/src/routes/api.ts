import express from "express";

import programRoutes from "./program";
import progressNoteRoutes from "./progressNote";
import sessionRoutes from "./session";
import studentRoutes from "./student";
import userRouter from "./user";

const router = express.Router();

// Register routers
router.use("/user", userRouter);
router.use("/student", studentRoutes);
router.use("/program", programRoutes);
router.use("/session", sessionRoutes);
router.use("/progressNote", progressNoteRoutes);

export default router;
