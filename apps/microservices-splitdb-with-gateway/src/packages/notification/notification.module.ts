import { NotificationRepository } from "src/database/other-database/repository/notification.repository";
import { Module } from "@nestjs/common";
import { NotificationService } from "src/packages/notification/notification.service";
import { NotificationController } from "src/packages/notification/notification.controller";

@Module({
  providers: [NotificationRepository, NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
