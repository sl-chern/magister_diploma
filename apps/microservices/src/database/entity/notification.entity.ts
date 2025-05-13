import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "notification" })
export class NotificationEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("text")
  text: string;

  @ManyToMany(() => UserEntity, (user) => user.notifications)
  users: UserEntity[];
}
