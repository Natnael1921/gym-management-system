import express from "express";
import {
  getMembers,
  addMember,
  editMember,
} from "../controllers/admin.controller.js";

import { requireAuth, requireRole } from "../middleware/authMiddleWare.js";

const router = express.Router();

//middleware for admin routes
router.use(requireAuth, requireRole("admin"));

// members
router.get("/members", getMembers);
router.post("/members", addMember);
router.put("/members/:id", editMember);

export default router;