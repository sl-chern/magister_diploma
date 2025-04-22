import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "permissions" })
export class PermissionEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column({ nullable: true })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.permissions)
  users: Array<UserEntity>;
}
