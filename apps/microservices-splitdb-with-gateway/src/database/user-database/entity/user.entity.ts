import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { RoleEntity } from "./role.entity";

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  is_confirmed: boolean;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  role: RoleEntity;

  @ManyToMany(() => PermissionEntity, (permission) => permission.users, {
    cascade: true,
  })
  @JoinTable()
  permissions: Array<PermissionEntity>;

  @ManyToMany(() => UserEntity, (subscriber) => subscriber.following)
  @JoinTable()
  subscribers: Array<UserEntity>;

  @ManyToMany(() => UserEntity, (following) => following.subscribers)
  following: Array<UserEntity>;
}
