import { MessageRepository } from "@/database/repository/message.repository";
import { Module } from "@nestjs/common";
import { MessageService } from "@/packages/message/message.service";
import { MessageController } from "@/packages/message/message.controller";

@Module({
  providers: [MessageRepository, MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
