-- CreateTable
CREATE TABLE `ExamSelectedAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `attendedById` INTEGER NULL,
    `examId` INTEGER NULL,
    `currentQuestionAnswerId` INTEGER NULL,
    `examAssignedId` INTEGER NULL,
    `selected_answer` ENUM('answer_a', 'answer_b', 'answer_c', 'answer_d') NULL DEFAULT 'answer_a',
    `correct_answer` ENUM('answer_a', 'answer_b', 'answer_c', 'answer_d') NULL DEFAULT 'answer_a',
    `marks` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExamSelectedAnswer` ADD CONSTRAINT `ExamSelectedAnswer_attendedById_fkey` FOREIGN KEY (`attendedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamSelectedAnswer` ADD CONSTRAINT `ExamSelectedAnswer_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamSelectedAnswer` ADD CONSTRAINT `ExamSelectedAnswer_currentQuestionAnswerId_fkey` FOREIGN KEY (`currentQuestionAnswerId`) REFERENCES `ExamQuestionAnswer`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `ExamSelectedAnswer` ADD CONSTRAINT `ExamSelectedAnswer_examAssignedId_fkey` FOREIGN KEY (`examAssignedId`) REFERENCES `ExamAssigned`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
