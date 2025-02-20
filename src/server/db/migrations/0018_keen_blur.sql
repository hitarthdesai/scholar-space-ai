CREATE TABLE `questionSelectedOption` (
	`userId` text NOT NULL,
	`questionId` text NOT NULL,
	`optionId` text NOT NULL,
	`lastAttempted` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`optionId`) REFERENCES `questionOption`(`optionId`) ON UPDATE no action ON DELETE cascade
);
