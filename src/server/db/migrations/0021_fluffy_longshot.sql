CREATE TABLE `questionFeedback` (
	`userId` text NOT NULL,
	`questionId` text NOT NULL,
	`grade` integer NOT NULL,
	`feedback` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE cascade
);
