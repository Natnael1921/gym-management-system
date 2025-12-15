import express from "express";
import {
  getMyProfile,
  getMyAttendance,
  getTrainers,
  requestTrainer,
  getMySchedule,
  updateMySchedule,
  updateMyProfile,
} from "../controllers/member.controller.js";
import { requireAuth, requireRole } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.use(requireAuth, requireRole("member"));

router.get("/me", getMyProfile);
router.get("/attendance", getMyAttendance);
router.get("/trainers", getTrainers);
router.post("/request-trainer", requestTrainer);
router.get("/schedule", getMySchedule);
router.put("/schedule", updateMySchedule);
router.patch("/profile", updateMyProfile);

export default router;
