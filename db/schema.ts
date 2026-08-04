import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  createdAt: text("created_at").notNull(),
  lastActivity: text("last_activity").notNull(),
});

export const reminders = sqliteTable("reminders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id").notNull(),
  manager: text("manager").notNull(),
  message: text("message").notNull(),
  remindAt: text("remind_at").notNull(),
  status: text("status").notNull().default("planned"),
  createdAt: text("created_at").notNull(),
});

export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  spentAt: text("spent_at").notNull(),
  videoId: text("video_id"),
});
