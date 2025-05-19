import { NotificationEntity } from "src/database/other-database/entity/notification.entity";
import { NotificationRepository } from "src/database/other-database/repository/notification.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(notification: Partial<NotificationEntity>) {
    return this.notificationRepository.save(notification);
  }

  async findAll(userId: string) {
    return this.notificationRepository.find({
      where: {
        userNotifications: {
          userId: userId,
        },
      },
      relations: ["userNotifications"],
    });
  }

  async findOne(id: string) {
    return this.notificationRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, notification: Partial<NotificationEntity>) {
    await this.notificationRepository.update(id, notification);
    return this.findOne(id);
  }

  async delete(id: string) {
    return this.notificationRepository.delete(id);
  }
}
