import { MessageEntity } from "src/database/entity/message.entity";
import { MessageRepository } from "src/database/repository/message.repository";
import { Injectable } from "@nestjs/common";
import { GetAllMessagesDto } from "src/packages/message/dto/get-all-messages.dto";

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async create(message: Partial<MessageEntity>) {
    return this.messageRepository.save(message);
  }

  async findAll(getAllMessagesDto: GetAllMessagesDto) {
    return this.messageRepository.find({
      where: [
        {
          sender: {
            id: getAllMessagesDto.senderId,
          },
          recipient: {
            id: getAllMessagesDto.recieverId,
          },
        },
        {
          sender: {
            id: getAllMessagesDto.recieverId,
          },
          recipient: {
            id: getAllMessagesDto.senderId,
          },
        },
      ],
      relations: ["sender", "recipient"],
    });
  }

  async findOne(id: string) {
    return this.messageRepository.findOne({
      where: { id },
      relations: ["sender", "recipient"],
    });
  }

  async update(id: string, message: Partial<MessageEntity>) {
    await this.messageRepository.update(id, message);
    return this.findOne(id);
  }

  async delete(id: string) {
    return this.messageRepository.delete(id);
  }
}
