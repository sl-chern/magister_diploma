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
        port: +(process.env.DB_OTHER_PORT || 5433),
        database: process.env.DB_OTHER_NAME || "db",
        username: process.env.DB_USERNAME || "pguser",
        password: process.env.DB_PASSWORD || "pguser",
      };

  options = Object.assign(options, {
    entities: ["src/database/other-database/entity/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: true,
    migrationsTableName: "migrations_typeorm",
    migrations: ["src/database/other-database/migrations/*{.ts,.js}"],
    logging: true,
  });

  const dataSource = new DataSource(
    options as DataSourceOptions & SeederOptions,
  );

  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: [
      "src/database/other-database/seed/seeders/notification.seeder.ts",
      "src/database/other-database/seed/seeders/message.seeder.ts",
    ],
    factories: ["src/database/other-database/seed/factories/**/*{.ts,.js}"],
  });
}

run();
