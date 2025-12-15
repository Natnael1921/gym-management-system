import express from "express";
import {
  getMyProfile,
  getMyAttendance,
  getTrainers,
  requestTrainer
} from "../controllers/member.controller.js";
import { requireAuth, requireRole } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.use(requireAuth, requireRole("member"));

router.get("/me", getMyProfile);
router.get("/attendance", getMyAttendance);
router.get("/trainers", getTrainers);
router.post("/request-trainer", requestTrainer);

export default router;
