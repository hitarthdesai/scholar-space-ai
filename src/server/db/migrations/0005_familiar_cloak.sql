CREATE TABLE `classroomStudent` (
	`classroomId` text NOT NULL,
	`studentId` text NOT NULL,
	FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`studentId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `classroom` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`teacherId` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
