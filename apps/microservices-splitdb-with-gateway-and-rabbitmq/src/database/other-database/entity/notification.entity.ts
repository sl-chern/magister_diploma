import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserNotificationEntity } from "./user-notification.entity";

@Entity({ name: "notification" })
export class NotificationEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("text")
  text: string;

  @OneToMany(
    () => UserNotificationEntity,
    (userNotification) => userNotification.notification,
    { cascade: ["remove"] },
  )
  userNotifications: UserNotificationEntity[];
}
