import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateBusiness } from "@/services/business";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";

const onboardingSchema = z.object({
  businessType: z.enum(["pharmacy", "clothing", "grocery"], {
    message: "Please select a business type.",
  }),
  address: z.string().min(1, "Address is required."),
  gstNumber: z.string().optional(),
  phone: z.string().min(10, "Valid phone number is required."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export function Onboarding() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      address: "",
      gstNumber: "",
      phone: "",
      email: "",
    }
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      setSubmitError(null);
      await updateBusiness({
        ...data,
        // Replace empty strings with null for backend compatibility if they are optional strings in the Business schema
        gstNumber: data.gstNumber || null,
        email: data.email || null,
        onboardingCompleted: true,
      });
      navigate("/app");
    } catch {
      setSubmitError("Failed to save business details. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Business OS</CardTitle>
          <CardDescription>
            Let's set up your business details before you get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {submitError && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                {submitError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type <span className="text-destructive">*</span></Label>
              <Select onValueChange={(value) => setValue("businessType", value as any, { shouldValidate: true })}>
                <SelectTrigger id="businessType" className={errors.businessType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="clothing" disabled>Clothing (Coming Soon)</SelectItem>
                  <SelectItem value="grocery" disabled>Grocery (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
              {errors.businessType && (
                <p className="text-sm text-destructive">{errors.businessType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
              <Input 
                id="address" 
                placeholder="Business Address" 
                {...register("address")} 
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input 
                id="gstNumber" 
                placeholder="Optional" 
                {...register("gstNumber")} 
              />
              {errors.gstNumber && (
                <p className="text-sm text-destructive">{errors.gstNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
              <Input 
                id="phone" 
                placeholder="10-digit number" 
                {...register("phone")} 
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Optional" 
                {...register("email")} 
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete Setup"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
