import express from "express";
import { getMyProfile } from "../controllers/member.controller.js";
import { requireAuth, requireRole } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.use(requireAuth, requireRole("member"));

router.get("/me", getMyProfile);

export default router;
