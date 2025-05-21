import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserRepository } from "./repository/user.repository";
import { PermissionEntity } from "./entity/permission.entity";
import { PermissionRepository } from "./repository/permission.repository";
import { RoleEntity } from "./entity/role.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PermissionEntity, RoleEntity]),
  ],
  exports: [TypeOrmModule, UserRepository, PermissionRepository],
  providers: [UserRepository, PermissionRepository],
})
export class UserDatabaseModule {}
