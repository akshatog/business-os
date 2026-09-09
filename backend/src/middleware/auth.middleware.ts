import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import prisma from "../db/client.js";

interface JwtPayload {
  userId: string;
  role: Role;
  businessId: string;
}

function getJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  // DB check: verify the user is still active on every request (per EDGE_CASES.md)
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, businessId: true, isActive: true },
  });

  if (!user || !user.isActive) {
    res.status(403).json({ error: "Account is deactivated or not found" });
    return;
  }

  req.user = user;
  next();
}
