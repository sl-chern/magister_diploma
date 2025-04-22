import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import dbConfig from "@/config/database.config";
import { DatabaseModule } from "@/database/database.module";
import { AuthModule } from "@/auth/auth.module";
import { RedisModule } from "@/redis/redis.module";
import { AuthModule as AuthModuleCrud } from "@/packages/auth/auth.module";
import { QuoteModule } from "@/packages/quote/quote.module";
import { UserModule } from "@/packages/user/user.module";
import { MessageModule } from "@/packages/message/message.module";
import { NotificationModule } from "@/packages/notification/notification.module";

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
