import { Module } from "@nestjs/common";
import { MessageService } from "src/packages/message/message.service";
import { MessageController } from "src/packages/message/message.controller";
import { MessageRepository } from "src/database/other-database/repository/message.repository";

@Module({
  providers: [MessageRepository, MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
