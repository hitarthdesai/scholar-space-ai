CREATE TABLE `assignment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `classroomAssignment` (
	`classroomId` text NOT NULL,
	`assignmentId` text NOT NULL,
	FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assignmentId`) REFERENCES `assignment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `question` (
	`id` text PRIMARY KEY NOT NULL,
	`assignmentId` text NOT NULL,
	`question` text(255) NOT NULL,
	FOREIGN KEY (`assignmentId`) REFERENCES `assignment`(`id`) ON UPDATE no action ON DELETE cascade
);
