ALTER TABLE `questions` DROP FOREIGN KEY `questions_level_id_levels_id_fk`;
--> statement-breakpoint
ALTER TABLE `questions` DROP COLUMN `level_id`;