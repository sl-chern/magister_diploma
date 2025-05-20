import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationEntity } from "./notification.entity";

@Entity({ name: "user_notification" })
export class UserNotificationEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("text", {
    name: "user_id",
  })
  userId: string;

  @ManyToOne(
    () => NotificationEntity,
    (notification) => notification.userNotifications,
  )
  notification: NotificationEntity;
}
