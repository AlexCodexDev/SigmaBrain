ALTER TABLE `questions` ADD `gameModesId` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_gameModesId_game_modes_id_fk` FOREIGN KEY (`gameModesId`) REFERENCES `game_modes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` DROP COLUMN `difficulty`;