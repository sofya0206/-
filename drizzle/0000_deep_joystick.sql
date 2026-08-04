CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`age_group` text NOT NULL,
	`income_band` text NOT NULL,
	`source` text NOT NULL,
	`video` text NOT NULL,
	`utm` text NOT NULL,
	`stage` text DEFAULT 'Новая' NOT NULL,
	`manager` text DEFAULT 'Не назначен' NOT NULL,
	`revenue` integer DEFAULT 0 NOT NULL,
	`response_minutes` integer DEFAULT 0 NOT NULL,
	`tags` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`last_activity` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`amount` integer NOT NULL,
	`spent_at` text NOT NULL,
	`video_id` text
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer NOT NULL,
	`manager` text NOT NULL,
	`message` text NOT NULL,
	`remind_at` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`created_at` text NOT NULL
);
