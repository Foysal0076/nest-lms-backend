-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('General', 'Diploma', 'Degree');

-- CreateTable
CREATE TABLE "CourseCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "featuredImage" TEXT,
    "description" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseLevel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTag" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "whoIsFor" TEXT,
    "prerequisite" TEXT,
    "learningOutcome" TEXT,
    "overview" TEXT,
    "featuredImage" TEXT,
    "validityInDays" INTEGER,
    "regularPrice" DOUBLE PRECISION,
    "salePrice" DOUBLE PRECISION,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "moduleOrder" TEXT,
    "createdById" INTEGER NOT NULL,
    "courseProviderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "featuredImage" TEXT,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "CertificateType" NOT NULL DEFAULT 'General',
    "icon" TEXT,
    "featuredImage" TEXT,
    "regularPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentUrl" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" INTEGER NOT NULL,
    "resourceTypeId" INTEGER NOT NULL,
    "unitId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "content" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" INTEGER NOT NULL,
    "unitTypeId" INTEGER NOT NULL,
    "moduleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "totalMark" INTEGER NOT NULL,
    "passMark" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" INTEGER NOT NULL,
    "quizTypeId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "unitId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestionType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizQuestionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "mark" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" INTEGER NOT NULL,
    "quizQuestionTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestionOption" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" INTEGER NOT NULL,
    "quizQuestionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizQuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_InstructorCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToCourseCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToCourseTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToCourseLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_QuizToQuizQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategory_title_key" ON "CourseCategory"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategory_slug_key" ON "CourseCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CourseLevel_title_key" ON "CourseLevel"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CourseTag_title_key" ON "CourseTag"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Course_title_key" ON "Course"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceType_title_key" ON "ResourceType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "UnitType_title_key" ON "UnitType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "QuizType_title_key" ON "QuizType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_unitId_key" ON "Quiz"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestionType_title_key" ON "QuizQuestionType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentCourse_AB_unique" ON "_StudentCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentCourse_B_index" ON "_StudentCourse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InstructorCourse_AB_unique" ON "_InstructorCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_InstructorCourse_B_index" ON "_InstructorCourse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToCourseCategory_AB_unique" ON "_CourseToCourseCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToCourseCategory_B_index" ON "_CourseToCourseCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToCourseTag_AB_unique" ON "_CourseToCourseTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToCourseTag_B_index" ON "_CourseToCourseTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToCourseLevel_AB_unique" ON "_CourseToCourseLevel"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToCourseLevel_B_index" ON "_CourseToCourseLevel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_QuizToQuizQuestion_AB_unique" ON "_QuizToQuizQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_QuizToQuizQuestion_B_index" ON "_QuizToQuizQuestion"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_courseProviderId_fkey" FOREIGN KEY ("courseProviderId") REFERENCES "CourseProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_resourceTypeId_fkey" FOREIGN KEY ("resourceTypeId") REFERENCES "ResourceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_quizTypeId_fkey" FOREIGN KEY ("quizTypeId") REFERENCES "QuizType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizQuestionTypeId_fkey" FOREIGN KEY ("quizQuestionTypeId") REFERENCES "QuizQuestionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestionOption" ADD CONSTRAINT "QuizQuestionOption_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentCourse" ADD CONSTRAINT "_StudentCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentCourse" ADD CONSTRAINT "_StudentCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstructorCourse" ADD CONSTRAINT "_InstructorCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstructorCourse" ADD CONSTRAINT "_InstructorCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseCategory" ADD CONSTRAINT "_CourseToCourseCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseCategory" ADD CONSTRAINT "_CourseToCourseCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseTag" ADD CONSTRAINT "_CourseToCourseTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseTag" ADD CONSTRAINT "_CourseToCourseTag_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseLevel" ADD CONSTRAINT "_CourseToCourseLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseLevel" ADD CONSTRAINT "_CourseToCourseLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizToQuizQuestion" ADD CONSTRAINT "_QuizToQuizQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizToQuizQuestion" ADD CONSTRAINT "_QuizToQuizQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
