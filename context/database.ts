import { CloudflareContext } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const votes = sqliteTable("votes", {
  id: int().primaryKey({ autoIncrement: true }),
  playlist_id: text().notNull(),
  voter_id: text(),
  contributor_ids: text(),
  track_ids: text(),
  honourable_mentions: text(),
  shame_votes: text(),
});

export const configs = sqliteTable("configs", {
  playlist_id: text().primaryKey(),
  created_by: text().notNull(),
  contributor_ids: text().notNull(),
  contributor_vote_count: int().default(1),
  track_vote_count: int().default(3),
  enable_honourable_mentions: int().default(1),
  enable_shame_votes: int().default(1),
  enable_voting: int().default(1),
});

export class Database {
  static async init(context: CloudflareContext) {
    return new this(context.cloudflare.env.DB);
  }

  orm;
  votes;
  configs;

  constructor(database: D1Database) {
    this.orm = drizzle(database);
    this.votes = votes;
    this.configs = configs;
  }
}
