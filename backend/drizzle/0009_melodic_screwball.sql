ALTER TABLE `game_sessions` DROP FOREIGN KEY `game_sessions_level_id_levels_id_fk`;
--> statement-breakpoint
ALTER TABLE `game_sessions` DROP COLUMN `level_id`;