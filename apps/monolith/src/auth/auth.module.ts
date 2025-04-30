import { Module } from "@nestjs/common";
import { JwtStrategy } from "./strategies/jwt.strategy";
import jwtConfig from "../config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../database/database.module";
import { UserRepository } from "../database/repository/user.repository";

@Module({
  imports: [DatabaseModule, ConfigModule.forFeature(jwtConfig)],
  providers: [JwtStrategy, UserRepository],
  exports: [],
})
export class AuthModule {}
