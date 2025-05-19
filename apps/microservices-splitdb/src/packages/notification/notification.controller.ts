import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { NotificationService } from "src/packages/notification/notification.service";
import { NotificationEntity } from "src/database/other-database/entity/notification.entity";
import { type UserPrincipal, ReqUser } from "@repo/auth";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() notification: Partial<NotificationEntity>) {
    return this.notificationService.create(notification);
  }

  @Get()
  async findAll(@ReqUser() user: UserPrincipal) {
    return this.notificationService.findAll(user.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.notificationService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() notification: Partial<NotificationEntity>,
  ) {
    return this.notificationService.update(id, notification);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.notificationService.delete(id);
  }
}
