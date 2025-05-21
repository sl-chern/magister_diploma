import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";

config({ path: "./.env.dev" });

async function run() {
  let options = process.env.DB_URL
    ? {
        type: process.env.DB_TYPE || "postgres",
        url: process.env.DB_URL || "postgres://user:password@localhost/db",
      }
    : {
        type: process.env.DB_TYPE || "postgres",
        host: process.env.DB_LOCAL_HOST || "localhost",
        port: +(process.env.DB_QUOTE_PORT || 5433),
        database: process.env.DB_QUOTE_NAME || "db",
        username: process.env.DB_USERNAME || "pguser",
        password: process.env.DB_PASSWORD || "pguser",
      };

  options = Object.assign(options, {
    entities: ["src/database/quote-database/entity/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: true,
    migrationsTableName: "migrations_typeorm",
    migrations: ["src/database/quote-database/migrations/*{.ts,.js}"],
    logging: true,
  });

  const dataSource = new DataSource(
    options as DataSourceOptions & SeederOptions,
  );

  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: ["src/database/quote-database/seed/seeders/quote.seeder.ts"],
    factories: ["src/database/quote-database/seed/factories/**/*{.ts,.js}"],
  });

  await runSeeders(dataSource, {
    seeds: [
      "src/database/quote-database/seed/seeders/like.seeder.ts",
      "src/database/quote-database/seed/seeders/repost.seeder.ts",
    ],
    factories: ["src/database/quote-database/seed/factories/**/*{.ts,.js}"],
  });
}

run();
