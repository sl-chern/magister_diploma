import { registerAs } from "@nestjs/config";
import { DatabaseConfig } from "@repo/utilities";

const folder = process.env.NODE_ENV ? "src" : "dist";

export default registerAs(
  "db",
  (): DatabaseConfig => ({
    type: process.env.DB_TYPE || "postgres",
    //url: process.env.DB_URL || 'postgres://user:password@localhost/db',
    host:
      process.env[`DB_${process.env.SERVICE_TYPE.toUpperCase()}_HOST`] ||
      "localhost",
    port: +(
      process.env[`DB_${process.env.SERVICE_TYPE.toUpperCase()}_PORT`] || 5432
    ),
    database:
      process.env.NODE_ENV === "test"
        ? "testdb"
        : process.env[`DB_${process.env.SERVICE_TYPE.toUpperCase()}_NAME`] ||
          "db",
    username: process.env.DB_USERNAME || "user",
    password: process.env.DB_PASSWORD || "password",
    entities: [
      `${folder}/database/${process.env.SERVICE_TYPE}-database/entity/**{.ts,.js}`,
    ],
    migrations: [
      `${folder}/database/${process.env.SERVICE_TYPE}-database/migrations/**{.ts,.js}`,
    ],
  }),
);
