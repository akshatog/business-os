import { type Request, type Response } from "express";
import { z } from "zod";
import { registerBusiness, login } from "../services/auth.service.js";

const RegisterSchema = z.object({
  businessName: z.string().min(1),
  ownerName: z.string().min(1),
  ownerEmail: z.string().email(),
  password: z.string().min(8),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  businessId: z.string().uuid(),
});

export async function registerBusinessHandler(req: Request, res: Response): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const result = await registerBusiness(parsed.data);
    res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    res.status(400).json({ error: message });
  }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const result = await login(parsed.data);
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    // Always 401 for auth failures — don't leak whether it was the email or password
    res.status(401).json({ error: message });
  }
}
