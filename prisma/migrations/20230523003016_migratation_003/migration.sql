/*
  Warnings:

  - The `title` column on the `Permission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `table` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TableAccess" AS ENUM ('READ', 'WRITE');

-- DropIndex
DROP INDEX "Permission_title_key";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "table" TEXT NOT NULL,
DROP COLUMN "title",
ADD COLUMN     "title" "TableAccess" NOT NULL DEFAULT 'READ';
