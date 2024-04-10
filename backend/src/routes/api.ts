import express from "express";

import emailRouter from "./email";
import programRoutes from "./program";
import studentRoutes from "./student";
import userRouter from "./user";

const router = express.Router();

// Register routers
router.use("/user", userRouter);
router.use("/student", studentRoutes);
router.use("/program", programRoutes);
router.post("/check-email", emailRouter);

export default router;
