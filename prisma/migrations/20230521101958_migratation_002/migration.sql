/*
  Warnings:

  - The values [EMAIL,PHONE] on the enum `VerificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VerificationType_new" AS ENUM ('Email', 'Phone');
ALTER TABLE "VerificationRequest" ALTER COLUMN "type" TYPE "VerificationType_new" USING ("type"::text::"VerificationType_new");
ALTER TYPE "VerificationType" RENAME TO "VerificationType_old";
ALTER TYPE "VerificationType_new" RENAME TO "VerificationType";
DROP TYPE "VerificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName";

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "gender" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VerificationRequest" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'Email';
