PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_questionFeedback` (
	`userId` text NOT NULL,
	`questionId` text NOT NULL,
	`grade` integer NOT NULL,
	`feedback` text NOT NULL,
	PRIMARY KEY(`userId`, `questionId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_questionFeedback`("userId", "questionId", "grade", "feedback") SELECT "userId", "questionId", "grade", "feedback" FROM `questionFeedback`;--> statement-breakpoint
DROP TABLE `questionFeedback`;--> statement-breakpoint
ALTER TABLE `__new_questionFeedback` RENAME TO `questionFeedback`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
