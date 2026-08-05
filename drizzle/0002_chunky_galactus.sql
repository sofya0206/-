ALTER TABLE `clients` ADD `subsequent_response_minutes` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `services` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `chat_analysis_status` text DEFAULT 'not_connected' NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `chat_summary` text DEFAULT '' NOT NULL;