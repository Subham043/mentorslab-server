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
    `uploadedBy` INTEGER NULL,
    `examId` INTEGER NULL,
    `draft` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `ExamQuestionAnswer_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExamQuestionAnswer` ADD CONSTRAINT `ExamQuestionAnswer_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamQuestionAnswer` ADD CONSTRAINT `ExamQuestionAnswer_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
