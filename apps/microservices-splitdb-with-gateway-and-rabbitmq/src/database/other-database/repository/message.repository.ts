import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { MessageEntity } from "../entity/message.entity";

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
  constructor(private dataSource: DataSource) {
    super(MessageEntity, dataSource.createEntityManager());
  }
}
