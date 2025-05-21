import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuoteEntity } from "./entity/quote.entity";
import { RepostEntity } from "./entity/repost.entity";
import { TagEntity } from "./entity/tag.entity";
import { QuoteRepository } from "./repository/quote.repository";
import { RepostRepository } from "./repository/repost.repository";
import { TagRepository } from "./repository/tag.repository";
import { LikeEntity } from "./entity/like.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuoteEntity,
      RepostEntity,
      TagEntity,
      LikeEntity,
    ]),
  ],
  exports: [TypeOrmModule, QuoteRepository, RepostRepository, TagRepository],
  providers: [QuoteRepository, RepostRepository, TagRepository],
})
export class QuoteDatabaseModule {}
