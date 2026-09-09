import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  registerBusinessHandler,
  loginHandler,
} from "../controllers/auth.controller.js";

const router = Router();

// Rate limit login to 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/register-business — public
router.post("/register-business", registerBusinessHandler);

// POST /api/auth/login — public, rate-limited
router.post("/login", loginLimiter, loginHandler);

export default router;
