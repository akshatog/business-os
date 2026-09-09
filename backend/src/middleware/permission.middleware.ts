import { type Request, type Response, type NextFunction } from "express";
import { hasPermission, type Permission } from "../lib/permissions.js";

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    if (!hasPermission(req.user.role, permission)) {
      res.status(403).json({ error: `Requires permission: ${permission}` });
      return;
    }

    next();
  };
}
