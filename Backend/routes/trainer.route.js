import express from "express";
import {
  getTrainerDashboard,
  getTrainerTrainees,
  getTrainerRequests,
  approveRequest,
  rejectRequest,
  getTrainerWeeklyAttendance,
  getTrainerMonthlyAttendance,
} from "../controllers/trainer.controller.js";

import { requireAuth, requireRole } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.use(requireAuth, requireRole("trainer"));

//trainer dashboard data routes
router.get("/dashboard", getTrainerDashboard);
router.get("/trainees", getTrainerTrainees);

//trainer requests
router.get("/requests", getTrainerRequests);
router.post("/requests/:id/approve", approveRequest);
router.post("/requests/:id/reject", rejectRequest);

//trainer attendances
router.get("/attendance/week", getTrainerWeeklyAttendance);
router.get("/attendance/month", getTrainerMonthlyAttendance);
export default router;
