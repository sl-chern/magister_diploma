import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import dbConfig from "src/config/database.config";
import { AuthModule } from "src/auth/auth.module";
import { RedisModule } from "@repo/redis";
import { AuthModule as AuthModuleCrud } from "src/packages/auth/auth.module";
import { UserModule } from "src/packages/user/user.module";
import { UserDatabaseModule } from "src/database/user-database/user-database.module";

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

        console.log(cfg);

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
    UserModule,
    UserDatabaseModule,
    RedisModule,
    AuthModuleCrud,
  ],
  controllers: [],
  providers: [],
})
export class UserServiceModule {}
