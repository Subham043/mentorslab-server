-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `otp` INTEGER NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `blocked` BOOLEAN NOT NULL DEFAULT false,
    `hashed_refresh_token` TEXT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `type` ENUM('PDF', 'VIDEO') NOT NULL DEFAULT 'VIDEO',
    `file_path` TEXT NOT NULL,
    `name` TEXT NOT NULL,
    `heading` TEXT NOT NULL,
    `description` TEXT NULL,
    `amount` VARCHAR(191) NULL,
    `uploadedBy` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `restricted` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Content_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentAssigned` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignedById` INTEGER NULL,
    `assignedToId` INTEGER NULL,
    `assignedContentId` INTEGER NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedRole` ENUM('ASSIGNED', 'PURCHASED') NOT NULL DEFAULT 'ASSIGNED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PAID_PARTIAL', 'PAID_FULL') NOT NULL DEFAULT 'PENDING',
    `amount` TEXT NOT NULL,
    `receipt` TEXT NULL,
    `paymentReferenceId` TEXT NULL,
    `paymentBy` INTEGER NULL,
    `forContentAssignedId` INTEGER NULL,

    UNIQUE INDEX `Payment_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveSessionContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image` TEXT NULL,
    `name` TEXT NOT NULL,
    `heading` TEXT NOT NULL,
    `description` TEXT NULL,
    `amount` VARCHAR(191) NULL,
    `uploadedBy` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `LiveSessionContent_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveSessionContentAssigned` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `requestedById` INTEGER NULL,
    `liveSessionContentId` INTEGER NULL,
    `scheduledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `scheduledOn` DATETIME(3) NULL,
    `assignedRole` ENUM('ASSIGNED', 'PURCHASED') NOT NULL DEFAULT 'ASSIGNED',
    `status` ENUM('PENDING', 'USER_REQUESTED', 'SCHEDULED', 'RESCHEDULED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `zoom` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentLiveSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PAID_PARTIAL', 'PAID_FULL') NOT NULL DEFAULT 'PENDING',
    `amount` TEXT NOT NULL,
    `receipt` TEXT NULL,
    `paymentReferenceId` TEXT NULL,
    `paymentBy` INTEGER NULL,
    `forLiveSessionContentAssignedId` INTEGER NULL,

    UNIQUE INDEX `PaymentLiveSession_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image` TEXT NULL,
    `name` TEXT NOT NULL,
    `heading` TEXT NOT NULL,
    `description` TEXT NULL,
    `amount` VARCHAR(191) NULL,
    `uploadedBy` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Exam_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `phone` TEXT NOT NULL,
    `message` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DemoSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `phone` TEXT NOT NULL,
    `message` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `facebook` TEXT NULL,
    `instagram` TEXT NULL,
    `twitter` TEXT NULL,
    `linkedin` TEXT NULL,
    `banner` TEXT NOT NULL,
    `video` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    `from_date` VARCHAR(191) NOT NULL,
    `to_date` VARCHAR(191) NULL,
    `time` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NULL,
    `uploadedBy` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Event_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventCallToAction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `heading` TEXT NULL,
    `description` TEXT NULL,
    `eventId` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `EventCallToAction_eventId_key`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventAbout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `heading` TEXT NULL,
    `description` TEXT NULL,
    `image` TEXT NULL,
    `eventId` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `EventAbout_eventId_key`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventTestimonial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NULL,
    `designation` TEXT NULL,
    `message` TEXT NULL,
    `image` TEXT NULL,
    `eventId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventInstructor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NULL,
    `designation` TEXT NULL,
    `description` TEXT NULL,
    `image` TEXT NULL,
    `facebook` TEXT NULL,
    `instagram` TEXT NULL,
    `twitter` TEXT NULL,
    `linkedin` TEXT NULL,
    `heading` TEXT NULL,
    `eventId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title` TEXT NULL,
    `description` TEXT NULL,
    `heading` TEXT NULL,
    `eventId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventGallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image` TEXT NULL,
    `eventId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventRegistration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `amount` TEXT NULL,
    `receipt` TEXT NULL,
    `name` TEXT NULL,
    `phone` TEXT NULL,
    `email` TEXT NULL,
    `message` TEXT NULL,
    `paymentReferenceId` TEXT NULL,
    `eventId` INTEGER NULL,

    UNIQUE INDEX `EventRegistration_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamQuestionAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `image` TEXT NULL,
    `question` TEXT NOT NULL,
    `answer_a` TEXT NULL,
    `answer_b` TEXT NULL,
    `answer_c` TEXT NULL,
    `answer_d` TEXT NULL,
    `correct_answer` ENUM('answer_a', 'answer_b', 'answer_c', 'answer_d') NOT NULL DEFAULT 'answer_a',
    `marks` INTEGER NULL DEFAULT 1,
    `duration` INTEGER NULL,
    `uploadedBy` INTEGER NULL,
    `examId` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `ExamQuestionAnswer_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamAssigned` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `requestedById` INTEGER NULL,
    `examId` INTEGER NULL,
    `questionAnswerId` INTEGER NULL,
    `assignedRole` ENUM('ASSIGNED', 'PURCHASED') NOT NULL DEFAULT 'ASSIGNED',
    `status` ENUM('PENDING', 'ONGOING', 'COMPLETED', 'ABORTED') NOT NULL DEFAULT 'PENDING',
    `reason` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentExam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PAID_PARTIAL', 'PAID_FULL') NOT NULL DEFAULT 'PENDING',
    `amount` TEXT NOT NULL,
    `receipt` TEXT NULL,
    `paymentReferenceId` TEXT NULL,
    `paymentBy` INTEGER NULL,
    `forExamAssignedId` INTEGER NULL,

    UNIQUE INDEX `PaymentExam_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ContentAssigned` ADD CONSTRAINT `ContentAssigned_assignedContentId_fkey` FOREIGN KEY (`assignedContentId`) REFERENCES `Content`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_paymentBy_fkey` FOREIGN KEY (`paymentBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_forContentAssignedId_fkey` FOREIGN KEY (`forContentAssignedId`) REFERENCES `ContentAssigned`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `LiveSessionContent` ADD CONSTRAINT `LiveSessionContent_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `LiveSessionContentAssigned` ADD CONSTRAINT `LiveSessionContentAssigned_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `LiveSessionContentAssigned` ADD CONSTRAINT `LiveSessionContentAssigned_liveSessionContentId_fkey` FOREIGN KEY (`liveSessionContentId`) REFERENCES `LiveSessionContent`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `PaymentLiveSession` ADD CONSTRAINT `PaymentLiveSession_paymentBy_fkey` FOREIGN KEY (`paymentBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `PaymentLiveSession` ADD CONSTRAINT `PaymentLiveSession_forLiveSessionContentAssignedId_fkey` FOREIGN KEY (`forLiveSessionContentAssignedId`) REFERENCES `LiveSessionContentAssigned`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `EventCallToAction` ADD CONSTRAINT `EventCallToAction_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `EventAbout` ADD CONSTRAINT `EventAbout_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `EventTestimonial` ADD CONSTRAINT `EventTestimonial_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `EventInstructor` ADD CONSTRAINT `EventInstructor_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `EventSchedule` ADD CONSTRAINT `EventSchedule_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `EventGallery` ADD CONSTRAINT `EventGallery_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `EventRegistration` ADD CONSTRAINT `EventRegistration_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamQuestionAnswer` ADD CONSTRAINT `ExamQuestionAnswer_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamQuestionAnswer` ADD CONSTRAINT `ExamQuestionAnswer_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamAssigned` ADD CONSTRAINT `ExamAssigned_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamAssigned` ADD CONSTRAINT `ExamAssigned_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamAssigned` ADD CONSTRAINT `ExamAssigned_questionAnswerId_fkey` FOREIGN KEY (`questionAnswerId`) REFERENCES `ExamQuestionAnswer`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `PaymentExam` ADD CONSTRAINT `PaymentExam_paymentBy_fkey` FOREIGN KEY (`paymentBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `PaymentExam` ADD CONSTRAINT `PaymentExam_forExamAssignedId_fkey` FOREIGN KEY (`forExamAssignedId`) REFERENCES `ExamAssigned`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
