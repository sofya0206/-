import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  ageGroup: text("age_group").notNull(),
  incomeBand: text("income_band").notNull(),
  source: text("source").notNull(),
  video: text("video").notNull(),
  utm: text("utm").notNull(),
  stage: text("stage").notNull().default("Новая"),
  manager: text("manager").notNull().default("Не назначен"),
  revenue: integer("revenue").notNull().default(0),
  responseMinutes: integer("response_minutes").notNull().default(0),
  tags: text("tags").notNull().default(""),
  notes: text("notes").notNull().default(""),
  nextFollowUp: text("next_follow_up"),
  dialogAt: text("dialog_at"),
  callAt: text("call_at"),
  saleAt: text("sale_at"),
  callDuration: integer("call_duration").notNull().default(0),
  callOutcome: text("call_outcome").notNull().default(""),
  createdAt: text("created_at").notNull(),
  lastActivity: text("last_activity").notNull(),
}, (table) => [
  index("idx_clients_stage").on(table.stage),
  index("idx_clients_manager").on(table.manager),
  index("idx_clients_utm").on(table.utm),
  index("idx_clients_created_at").on(table.createdAt),
]);

export const reminders = sqliteTable("reminders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id").notNull(),
  manager: text("manager").notNull(),
  message: text("message").notNull(),
  remindAt: text("remind_at").notNull(),
  status: text("status").notNull().default("planned"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  index("idx_reminders_due").on(table.status, table.remindAt),
  index("idx_reminders_client_id").on(table.clientId),
]);

export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  spentAt: text("spent_at").notNull(),
  videoId: text("video_id"),
  createdAt: text("created_at").notNull().default(""),
}, (table) => [
  index("idx_expenses_spent_at").on(table.spentAt),
  index("idx_expenses_category").on(table.category),
]);

export const managers = sqliteTable("managers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  telegram: text("telegram").notNull(),
  email: text("email").notNull().default(""),
  plan: integer("plan").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_managers_telegram_unique").on(table.telegram),
  index("idx_managers_status").on(table.status),
]);

export const videos = sqliteTable("videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  youtubeId: text("youtube_id").notNull(),
  title: text("title").notNull(),
  publishedAt: text("published_at").notNull(),
  utm: text("utm").notNull(),
  views: integer("views").notNull().default(0),
  leads: integer("leads").notNull().default(0),
  dialogs: integer("dialogs").notNull().default(0),
  calls: integer("calls").notNull().default(0),
  sales: integer("sales").notNull().default(0),
  revenue: integer("revenue").notNull().default(0),
  spend: integer("spend").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  uniqueIndex("idx_videos_youtube_id_unique").on(table.youtubeId),
  uniqueIndex("idx_videos_utm_unique").on(table.utm),
  index("idx_videos_published_at").on(table.publishedAt),
]);

export const productStats = sqliteTable("product_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  period: text("period").notNull(),
  activeStudents: integer("active_students").notNull().default(0),
  casesCount: integer("cases_count").notNull().default(0),
  nps: integer("nps").notNull().default(0),
  completionRate: integer("completion_rate").notNull().default(0),
  atRisk: integer("at_risk").notNull().default(0),
  avgResultDays: integer("avg_result_days").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("idx_product_stats_period_unique").on(table.period)]);

export const automationSettings = sqliteTable("automation_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  config: text("config").notNull().default("{}"),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("idx_automation_settings_key_unique").on(table.key)]);

export const activityEvents = sqliteTable("activity_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  entityId: integer("entity_id"),
  title: text("title").notNull(),
  detail: text("detail").notNull().default(""),
  createdAt: text("created_at").notNull(),
}, (table) => [index("idx_activity_events_created_at").on(table.createdAt)]);
