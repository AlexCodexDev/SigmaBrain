CREATE TABLE `answer_options` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`questions_id` bigint unsigned NOT NULL,
	`option` varchar(255) NOT NULL,
	`is_correct` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `answer_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_modes` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `game_modes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`game_modes_id` bigint unsigned NOT NULL,
	`level_id` bigint unsigned NOT NULL,
	`total_questions` int unsigned NOT NULL,
	`correct_answers` int unsigned NOT NULL,
	`wrong_answers` int unsigned NOT NULL,
	`total_score` int unsigned NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `game_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `levels` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`game_modes_id` bigint unsigned NOT NULL,
	`level` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `levels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`level_id` bigint unsigned NOT NULL,
	`question_text` varchar(255) NOT NULL,
	`attachment` text,
	`answer` varchar(255) NOT NULL,
	`difficulty` varchar(50) NOT NULL,
	`point` int unsigned NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_answers` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`game_sessions_id` bigint unsigned NOT NULL,
	`questions_id` bigint unsigned NOT NULL,
	`answer_options_id` bigint unsigned NOT NULL,
	`is_correct` boolean DEFAULT false,
	`score_earned` int unsigned NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `user_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` bigint unsigned AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `answer_options` ADD CONSTRAINT `answer_options_questions_id_questions_id_fk` FOREIGN KEY (`questions_id`) REFERENCES `questions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_game_modes_id_game_modes_id_fk` FOREIGN KEY (`game_modes_id`) REFERENCES `game_modes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_sessions` ADD CONSTRAINT `game_sessions_level_id_levels_id_fk` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `levels` ADD CONSTRAINT `levels_game_modes_id_game_modes_id_fk` FOREIGN KEY (`game_modes_id`) REFERENCES `game_modes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_level_id_levels_id_fk` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_game_sessions_id_game_sessions_id_fk` FOREIGN KEY (`game_sessions_id`) REFERENCES `game_sessions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_questions_id_questions_id_fk` FOREIGN KEY (`questions_id`) REFERENCES `questions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_answers` ADD CONSTRAINT `user_answers_answer_options_id_answer_options_id_fk` FOREIGN KEY (`answer_options_id`) REFERENCES `answer_options`(`id`) ON DELETE no action ON UPDATE no action;