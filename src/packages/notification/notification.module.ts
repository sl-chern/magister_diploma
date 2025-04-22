import { NotificationRepository } from "@/database/repository/notification.repository";
import { Module } from "@nestjs/common";
import { NotificationService } from "@/packages/notification/notification.service";
import { NotificationController } from "@/packages/notification/notification.controller";

@Module({
  providers: [NotificationRepository, NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
