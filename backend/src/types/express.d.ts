import { Role } from "@prisma/client";

// Extends Express's Request to carry the authenticated user after
// the authenticateToken middleware runs.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        businessId: string;
        isActive: boolean;
      };
    }
  }
}
