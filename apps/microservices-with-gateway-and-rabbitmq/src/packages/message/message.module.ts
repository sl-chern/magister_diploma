import { MessageRepository } from "src/database/repository/message.repository";
import { Module } from "@nestjs/common";
import { MessageService } from "src/packages/message/message.service";
import { MessageController } from "src/packages/message/message.controller";

@Module({
  providers: [MessageRepository, MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
