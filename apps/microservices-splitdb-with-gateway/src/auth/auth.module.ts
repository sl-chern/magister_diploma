import { Module } from "@nestjs/common";
import { JwtStrategy } from "./strategies/jwt.strategy";
import jwtConfig from "../config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { UserDatabaseModule } from "../database/user-database/user-database.module";
import { UserRepository } from "../database/user-database/repository/user.repository";

@Module({
  imports: [UserDatabaseModule, ConfigModule.forFeature(jwtConfig)],
  providers: [JwtStrategy, UserRepository],
  exports: [],
})
export class AuthModule {}
