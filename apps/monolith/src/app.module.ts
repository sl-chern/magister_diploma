import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import dbConfig from "src/config/database.config";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { RedisModule } from "@repo/redis";
import { AuthModule as AuthModuleCrud } from "src/packages/auth/auth.module";
import { QuoteModule } from "src/packages/quote/quote.module";
import { UserModule } from "src/packages/user/user.module";
import { MessageModule } from "src/packages/message/message.module";
import { NotificationModule } from "src/packages/notification/notification.module";

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
    UserModule,
    MessageModule,
    NotificationModule,
    DatabaseModule,
    RedisModule,
    AuthModuleCrud,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
