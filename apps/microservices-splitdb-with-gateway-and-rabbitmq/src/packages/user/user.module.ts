import { Module } from "@nestjs/common";
import { UserService } from "src/packages/user/user.service";
import { UserController } from "src/packages/user/user.controller";
import { UserRepository } from "src/database/user-database/repository/user.repository";

@Module({
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
