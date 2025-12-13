import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", requireAuth, register);

export default router;