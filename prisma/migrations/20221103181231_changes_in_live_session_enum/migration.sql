-- AlterTable
ALTER TABLE `LiveSessionContentAssigned` MODIFY `status` ENUM('PENDING', 'USER_REQUESTED', 'SCHEDULED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';
