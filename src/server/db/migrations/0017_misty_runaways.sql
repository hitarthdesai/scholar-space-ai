CREATE TABLE `questionOption` (
	`optionId` text PRIMARY KEY NOT NULL,
	`questionId` text NOT NULL,
	`label` text NOT NULL,
	`isCorrect` integer NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE cascade
);
