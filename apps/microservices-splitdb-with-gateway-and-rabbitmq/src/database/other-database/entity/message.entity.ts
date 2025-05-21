import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "message" })
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("text")
  text: string;

  @Column("uuid")
  sender: string;

  @Column("uuid")
  recipient: string;
}
