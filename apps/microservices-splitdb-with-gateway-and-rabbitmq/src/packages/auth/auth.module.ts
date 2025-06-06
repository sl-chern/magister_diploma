import { Module } from "@nestjs/common";
import { AuthService } from "src/packages/auth/auth.service";
import { RedisModule } from "@repo/redis";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigType } from "@nestjs/config";
import jwtConfig from "src/config/jwt.config";
import { AuthController } from "src/packages/auth/auth.controller";
import { UserModule } from "src/packages/user/user.module";
import { PermissionRepository } from "src/database/user-database/repository/permission.repository";
import { UserRepository } from "src/database/user-database/repository/user.repository";

@Module({
  providers: [AuthService, PermissionRepository, UserRepository],
  controllers: [AuthController],
  imports: [
    UserModule,
    RedisModule,
    ConfigModule.forRoot({
      load: [jwtConfig],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: (cfg: ConfigType<typeof jwtConfig>) => cfg,
      inject: [jwtConfig.KEY],
    }),
  ],
})
export class AuthModule {}
