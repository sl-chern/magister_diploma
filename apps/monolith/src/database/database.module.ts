import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserRepository } from "./repository/user.repository";
import { PermissionEntity } from "./entity/permission.entity";
import { LikeEntity } from "./entity/like.entity";
import { MessageEntity } from "./entity/message.entity";
import { NotificationEntity } from "./entity/notification.entity";
import { QuoteEntity } from "./entity/quote.entity";
import { RepostEntity } from "./entity/repost.entity";
import { TagEntity } from "./entity/tag.entity";
import { MessageRepository } from "./repository/message.repository";
import { NotificationRepository } from "./repository/notification.repository";
import { PermissionRepository } from "./repository/permission.repository";
import { QuoteRepository } from "./repository/quote.repository";
import { RepostRepository } from "./repository/repost.repository";
import { TagRepository } from "./repository/tag.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PermissionEntity,
      LikeEntity,
      MessageEntity,
      NotificationEntity,
      QuoteEntity,
      RepostEntity,
      TagEntity,
    ]),
  ],
  exports: [
    TypeOrmModule,
    UserRepository,
    MessageRepository,
    NotificationRepository,
    PermissionRepository,
    QuoteRepository,
    RepostRepository,
    TagRepository,
  ],
  providers: [
    UserRepository,
    MessageRepository,
    NotificationRepository,
    PermissionRepository,
    QuoteRepository,
    RepostRepository,
    TagRepository,
  ],
})
export class DatabaseModule {}
