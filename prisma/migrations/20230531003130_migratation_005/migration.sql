-- CreateEnum
CREATE TYPE "SubscriptionStatusType" AS ENUM ('Active', 'Inactive', 'Cancelled', 'Pending', 'Suspended', 'Trial', 'PastDue', 'Free');

-- AlterTable
ALTER TABLE "QuizQuestion" ALTER COLUMN "isPublished" SET DEFAULT true;

-- AlterTable
ALTER TABLE "QuizQuestionOption" ALTER COLUMN "isPublished" SET DEFAULT true;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "nextBilling" TIMESTAMP(3) NOT NULL,
    "status" "SubscriptionStatusType" NOT NULL,
    "subscriptionProductId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionProductType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionProduct" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "regularPrice" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION,
    "isSiteWide" BOOLEAN NOT NULL DEFAULT false,
    "typeId" INTEGER NOT NULL,
    "courseProviderId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompletedUnit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_title_key" ON "Subscription"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionProductId_key" ON "Subscription"("subscriptionProductId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionProductType_title_key" ON "SubscriptionProductType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionProduct_title_key" ON "SubscriptionProduct"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_CompletedUnit_AB_unique" ON "_CompletedUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_CompletedUnit_B_index" ON "_CompletedUnit"("B");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subscriptionProductId_fkey" FOREIGN KEY ("subscriptionProductId") REFERENCES "SubscriptionProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionProduct" ADD CONSTRAINT "SubscriptionProduct_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SubscriptionProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionProduct" ADD CONSTRAINT "SubscriptionProduct_courseProviderId_fkey" FOREIGN KEY ("courseProviderId") REFERENCES "CourseProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompletedUnit" ADD CONSTRAINT "_CompletedUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompletedUnit" ADD CONSTRAINT "_CompletedUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
