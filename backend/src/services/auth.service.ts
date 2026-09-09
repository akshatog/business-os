import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/client.js";

const BCRYPT_ROUNDS = 12;

function getJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

// ─────────────────────────────────────────────
// registerBusiness
// Creates a Business + Owner user in one transaction.
// Returns a JWT so the caller is logged in immediately.
// ─────────────────────────────────────────────
export interface RegisterBusinessInput {
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  password: string;
}

export async function registerBusiness(input: RegisterBusinessInput): Promise<{ token: string }> {
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const { business, user } = await prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        name: input.businessName,
        onboardingCompleted: false,
        // businessType, address, phone all stay null until onboarding
      },
    });

    const user = await tx.user.create({
      data: {
        businessId: business.id,
        name: input.ownerName,
        email: input.ownerEmail,
        passwordHash,
        role: "owner",
      },
    });

    return { business, user };
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role, businessId: business.id },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

  return { token };
}

// ─────────────────────────────────────────────
// login
// ─────────────────────────────────────────────
export interface LoginInput {
  email: string;
  password: string;
  businessId: string;
}

export async function login(input: LoginInput): Promise<{ token: string }> {
  const user = await prisma.user.findFirst({
    where: { email: input.email, businessId: input.businessId },
  });

  // Generic error to prevent email enumeration
  if (!user) throw new Error("Invalid credentials");

  const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordValid) throw new Error("Invalid credentials");

  if (!user.isActive) throw new Error("Account is deactivated");

  const token = jwt.sign(
    { userId: user.id, role: user.role, businessId: user.businessId },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

  return { token };
}
