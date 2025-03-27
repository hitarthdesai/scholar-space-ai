CREATE TABLE `assignmentAttempt` (
	`userId` text NOT NULL,
	`assignmentId` text NOT NULL,
	`submitted` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assignmentId`) REFERENCES `assignment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `questionAttempt` DROP COLUMN `submitted`;--> statement-breakpoint
ALTER TABLE `questionAttempt` DROP COLUMN `answer`;--> statement-breakpoint
ALTER TABLE `questionSelectedOption` DROP COLUMN `lastAttempted`;