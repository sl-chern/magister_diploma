import { Module } from "@nestjs/common";
import { UserRepository } from "@/database/repository/user.repository";
import { UserService } from "@/packages/user/user.service";
import { UserController } from "@/packages/user/user.controller";

@Module({
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
