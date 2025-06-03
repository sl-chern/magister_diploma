import { Controller } from "@nestjs/common";
import { MessageService } from "src/packages/message/message.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { GetAllMessagesDto } from "src/packages/message/dto/get-all-messages.dto";
import { MessageEntity } from "src/database/other-database/entity/message.entity";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern("createMessage")
  async create(@Payload() message: Partial<MessageEntity>) {
    return this.messageService.create(message);
  }

  @MessagePattern("getMessages")
  async findAll(@Payload() body: GetAllMessagesDto) {
    return this.messageService.findAll(body);
  }

  @MessagePattern("getMessage")
  async findOne(@Payload() body: { id: string }) {
    return this.messageService.findOne(body.id);
  }

  @MessagePattern("updateMessage")
  async update(@Payload() message: Partial<MessageEntity>) {
    return this.messageService.update(message.id, message);
  }

  @MessagePattern("deleteMessage")
  async delete(@Payload() body: { id: string }) {
    return this.messageService.delete(body.id);
  }
}
