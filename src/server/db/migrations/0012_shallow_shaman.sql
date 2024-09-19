CREATE TABLE `classroomParticipant` (
	`classroomId` text NOT NULL,
	`userId` text NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `classroomStudent`;--> statement-breakpoint
CREATE UNIQUE INDEX `classroomParticipant_classroomId_userId_unique` ON `classroomParticipant` (`classroomId`,`userId`);--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `classroom` DROP COLUMN `teacherId`;