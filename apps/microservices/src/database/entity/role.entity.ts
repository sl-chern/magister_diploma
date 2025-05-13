import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "role" })
export class RoleEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
