CREATE TABLE `activity_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`entity_id` integer,
	`title` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_activity_events_created_at` ON `activity_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `automation_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`config` text DEFAULT '{}' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_automation_settings_key_unique` ON `automation_settings` (`key`);--> statement-breakpoint
CREATE TABLE `managers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`telegram` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`plan` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_managers_telegram_unique` ON `managers` (`telegram`);--> statement-breakpoint
CREATE INDEX `idx_managers_status` ON `managers` (`status`);--> statement-breakpoint
CREATE TABLE `product_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`period` text NOT NULL,
	`active_students` integer DEFAULT 0 NOT NULL,
	`cases_count` integer DEFAULT 0 NOT NULL,
	`nps` integer DEFAULT 0 NOT NULL,
	`completion_rate` integer DEFAULT 0 NOT NULL,
	`at_risk` integer DEFAULT 0 NOT NULL,
	`avg_result_days` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_product_stats_period_unique` ON `product_stats` (`period`);--> statement-breakpoint
CREATE TABLE `videos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`youtube_id` text NOT NULL,
	`title` text NOT NULL,
	`published_at` text NOT NULL,
	`utm` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`leads` integer DEFAULT 0 NOT NULL,
	`dialogs` integer DEFAULT 0 NOT NULL,
	`calls` integer DEFAULT 0 NOT NULL,
	`sales` integer DEFAULT 0 NOT NULL,
	`revenue` integer DEFAULT 0 NOT NULL,
	`spend` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_videos_youtube_id_unique` ON `videos` (`youtube_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_videos_utm_unique` ON `videos` (`utm`);--> statement-breakpoint
CREATE INDEX `idx_videos_published_at` ON `videos` (`published_at`);--> statement-breakpoint
ALTER TABLE `clients` ADD `notes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `next_follow_up` text;--> statement-breakpoint
ALTER TABLE `clients` ADD `dialog_at` text;--> statement-breakpoint
ALTER TABLE `clients` ADD `call_at` text;--> statement-breakpoint
ALTER TABLE `clients` ADD `sale_at` text;--> statement-breakpoint
ALTER TABLE `clients` ADD `call_duration` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `call_outcome` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_clients_stage` ON `clients` (`stage`);--> statement-breakpoint
CREATE INDEX `idx_clients_manager` ON `clients` (`manager`);--> statement-breakpoint
CREATE INDEX `idx_clients_utm` ON `clients` (`utm`);--> statement-breakpoint
CREATE INDEX `idx_clients_created_at` ON `clients` (`created_at`);--> statement-breakpoint
ALTER TABLE `expenses` ADD `created_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_expenses_spent_at` ON `expenses` (`spent_at`);--> statement-breakpoint
CREATE INDEX `idx_expenses_category` ON `expenses` (`category`);--> statement-breakpoint
CREATE INDEX `idx_reminders_due` ON `reminders` (`status`,`remind_at`);--> statement-breakpoint
CREATE INDEX `idx_reminders_client_id` ON `reminders` (`client_id`);