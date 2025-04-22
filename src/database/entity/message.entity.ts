import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "message" })
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("text")
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.sendedMessages, {
    nullable: true,
  })
  sender?: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.recievedMessages, {
    nullable: true,
  })
  recipient?: UserEntity;
}
