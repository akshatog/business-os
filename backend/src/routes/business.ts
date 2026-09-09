import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { updateOnboardingHandler } from "../controllers/business.controller.js";

const router = Router();

// PATCH /api/business/me — owner only
// Gate: authenticated + owner role (which has no special permission beyond ownership,
// so we check for manage_users as the owner-only sentinel permission)
router.patch(
  "/me",
  authenticateToken,
  requirePermission("manage_users"),
  updateOnboardingHandler
);

export default router;
