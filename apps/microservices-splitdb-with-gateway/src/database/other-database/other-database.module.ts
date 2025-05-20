import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "./entity/message.entity";
import { NotificationEntity } from "./entity/notification.entity";
import { MessageRepository } from "./repository/message.repository";
import { NotificationRepository } from "./repository/notification.repository";
import { UserNotificationEntity } from "./entity/user-notification.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageEntity,
      NotificationEntity,
      UserNotificationEntity,
    ]),
  ],
  exports: [TypeOrmModule, MessageRepository, NotificationRepository],
  providers: [MessageRepository, NotificationRepository],
})
export class OtherDatabaseModule {}
