import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import dbConfig from "src/config/database.config";
import { AuthModule } from "src/auth/auth.module";
import { RedisModule } from "@repo/redis";
import { QuoteModule } from "src/packages/quote/quote.module";
import { QuoteDatabaseModule } from "src/database/quote-database/quote-database.module";

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      useFactory: (cfg: ConfigType<typeof dbConfig>) => {
        const options = cfg.url
          ? {
              type: cfg.type,
              url: cfg.url,
            }
          : {
              type: cfg.type,
              host: cfg.host,
              port: cfg.port,
              database: cfg.database,
              username: cfg.username,
              password: cfg.password,
            };

        return Object.assign(options, {
          entities: cfg.entities,
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          migrationsTableName: "migrations_typeorm",
          migrations: cfg.migrations,
          logging: true,
        }) as TypeOrmModuleOptions;
      },
      inject: [dbConfig.KEY],
    }),
    AuthModule,
    QuoteModule,
    QuoteDatabaseModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class QuoteServiceModule {}
