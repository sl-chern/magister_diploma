import { Controller } from "@nestjs/common";
import { NotificationService } from "src/packages/notification/notification.service";
import { type UserPrincipal } from "@repo/auth";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { NotificationEntity } from "src/database/other-database/entity/notification.entity";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern("createNotification")
  async create(@Payload() notification: Partial<NotificationEntity>) {
    return this.notificationService.create(notification);
  }

  @MessagePattern("findNotifications")
  async findAll(@Payload() user: UserPrincipal) {
    return this.notificationService.findAll(user.id);
  }

  @MessagePattern("findNotification")
  async findOne(@Payload() body: { id: string }) {
    return this.notificationService.findOne(body.id);
  }

  @MessagePattern("updateNotification")
  async update(@Payload() notification: Partial<NotificationEntity>) {
    return this.notificationService.update(notification.id, notification);
  }

  @MessagePattern("deleteNotification")
  async delete(@Payload() body: { id: string }) {
    return this.notificationService.delete(body.id);
  }
}
