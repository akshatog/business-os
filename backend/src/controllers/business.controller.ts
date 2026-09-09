import { type Request, type Response } from "express";
import { z } from "zod";
import { updateOnboarding } from "../services/business.service.js";

const OnboardingSchema = z.object({
  businessType: z.string().min(1),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  phone: z.string().optional(),
});

export async function updateOnboardingHandler(req: Request, res: Response): Promise<void> {
  // requirePermission and authenticateToken run before this handler
  // req.user is guaranteed to exist and be an owner at this point
  const businessId = req.user!.businessId;

  const parsed = OnboardingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    await updateOnboarding(businessId, parsed.data);
    res.status(200).json({ message: "Onboarding complete" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onboarding update failed";
    res.status(400).json({ error: message });
  }
}
