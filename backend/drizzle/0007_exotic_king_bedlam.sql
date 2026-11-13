ALTER TABLE `answer_options` MODIFY COLUMN `option` text NOT NULL;--> statement-breakpoint
ALTER TABLE `questions` MODIFY COLUMN `answer` text NOT NULL;