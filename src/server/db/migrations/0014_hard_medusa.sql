CREATE TABLE `classroomConversation` (
	`classroomId` text NOT NULL,
	`conversationId` text NOT NULL,
	FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE cascade
);
