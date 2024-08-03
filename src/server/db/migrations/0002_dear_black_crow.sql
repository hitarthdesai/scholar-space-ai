CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text(200) NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`by` text NOT NULL
);
