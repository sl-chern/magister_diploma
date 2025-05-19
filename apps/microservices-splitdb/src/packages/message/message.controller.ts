import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { MessageService } from "src/packages/message/message.service";
import { MessageEntity } from "src/database/other-database/entity/message.entity";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() message: Partial<MessageEntity>) {
    return this.messageService.create(message);
  }

  @Get()
  async findAll(
    @Query("sender") senderId: string,
    @Query("reciever") recieverId: string,
  ) {
    return this.messageService.findAll({
      senderId,
      recieverId,
    });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.messageService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() message: Partial<MessageEntity>,
  ) {
    return this.messageService.update(id, message);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.messageService.delete(id);
  }
}
