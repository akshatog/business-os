-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "businessType" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;
