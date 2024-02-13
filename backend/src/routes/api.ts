import express from "express";

import studentRoutes from "./student";
import { userRouter } from "./user";

const router = express.Router();

// Register routers
router.use("/user", userRouter);
router.use("/student", studentRoutes);

export default router;
