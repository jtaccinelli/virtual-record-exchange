import { CloudflareContext } from "@remix-run/cloudflare";

import { SQL } from "drizzle-orm";
import {
  sqliteTable,
  int,
  text,
  SQLiteUpdateSetSource,
  SQLiteInsertValue,
} from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/d1";

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

type AllTables = typeof votes | typeof configs;

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

  select<Table extends AllTables>(
    table: Table,
    callbacks: {
      where: (table: Table) => SQL | undefined;
    },
  ) {
    return this.orm.select().from(table).where(callbacks.where(table));
  }

  delete<Table extends AllTables>(
    table: Table,
    callbacks: {
      where: (table: Table) => SQL | undefined;
    },
  ) {
    return this.orm.delete(table).where(callbacks.where(table));
  }

  insert<Table extends AllTables>(
    table: Table,
    callbacks: {
      set: () => SQLiteInsertValue<Table>;
    },
  ) {
    return this.orm.insert(table).values(callbacks.set());
  }

  update<Table extends AllTables>(
    table: Table,
    callbacks: {
      set: () => SQLiteUpdateSetSource<Table>;
      where: (table: Table) => SQL | undefined;
    },
  ) {
    return this.orm
      .update(table)
      .set(callbacks.set())
      .where(callbacks.where(table));
  }
}
