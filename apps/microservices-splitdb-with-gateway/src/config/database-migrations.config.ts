import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

config({ path: "./.env.dev" });

let options = process.env.DB_URL
  ? {
      type: process.env.DB_TYPE || "postgres",
      url: process.env.DB_URL || "postgres://user:password@localhost/db",
    }
  : {
      type: process.env.DB_TYPE || "postgres",
      host: process.env.DB_LOCAL_HOST || "localhost",
      port: +(
        process.env[`DB_${process.env.SERVICE_TYPE.toUpperCase()}_PORT`] || 5433
      ),
      database:
        process.env[`DB_${process.env.SERVICE_TYPE.toUpperCase()}_NAME`] ||
        "db",
      username: process.env.DB_USERNAME || "pguser",
      password: process.env.DB_PASSWORD || "pguser",
    };

options = Object.assign(options, {
  entities: [
    `src/database/${process.env.SERVICE_TYPE}-database/entity/**{.ts,.js}`,
  ],
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: true,
  migrationsTableName: "migrations_typeorm",
  migrations: [
    `src/database/${process.env.SERVICE_TYPE}-database/migrations/*{.ts,.js}`,
  ],
  seeds: [`src/database/${process.env.SERVICE_TYPE}-database/seed/*{.ts,.js}`],
  factories: [
    `src/database/${process.env.SERVICE_TYPE}-database/factory/*{.ts,.js}`,
  ],
  logging: true,
});

console.log(options);

const connectionSource = new DataSource(
  options as DataSourceOptions & SeederOptions,
);

export default connectionSource;
