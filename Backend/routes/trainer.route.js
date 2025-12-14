import express from "express";
import {
  getTrainerDashboard,
  getTrainerTrainees,
} from "../controllers/trainer.controller.js";

import { requireAuth, requireRole } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.use(requireAuth, requireRole("trainer"));

//trainer dashboard data routes
router.get("/dashboard", getTrainerDashboard);
router.get("/trainees", getTrainerTrainees);

export default router;