import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { QuoteEntity } from "./quote.entity";
import { LikeEntity } from "./like.entity";
import { MessageEntity } from "./message.entity";
import { NotificationEntity } from "./notification.entity";
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

  @OneToMany(() => QuoteEntity, (quote) => quote.author, { cascade: true })
  quotes: Array<QuoteEntity>;

  @OneToMany(() => MessageEntity, (message) => message.sender, {
    cascade: true,
    onDelete: "SET NULL",
  })
  sendedMessages: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.recipient, {
    cascade: true,
    onDelete: "SET NULL",
  })
  recievedMessages: MessageEntity[];

  @ManyToMany(() => UserEntity, (subscriber) => subscriber.following)
  @JoinTable()
  subscribers: Array<UserEntity>;

  @ManyToMany(() => UserEntity, (following) => following.subscribers)
  following: Array<UserEntity>;

  @OneToMany(() => LikeEntity, (like) => like.quote, { cascade: true })
  likes: LikeEntity[];

  @ManyToMany(() => NotificationEntity, (notification) => notification.users, {
    cascade: true,
  })
  @JoinTable()
  notifications: NotificationEntity[];
}
