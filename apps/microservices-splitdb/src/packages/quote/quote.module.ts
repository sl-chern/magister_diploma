import { Module } from "@nestjs/common";
import { QuoteRepository } from "src/database/quote-database/repository/quote.repository";
import { QuoteController } from "src/packages/quote/quote.controller";
import { QuoteService } from "src/packages/quote/quote.service";
import { UserRepository } from "src/database/user-database/repository/user.repository";
import { TagRepository } from "src/database/quote-database/repository/tag.repository";
import { RepostRepository } from "src/database/quote-database/repository/repost.repository";

@Module({
  providers: [
    QuoteRepository,
    UserRepository,
    TagRepository,
    RepostRepository,
    QuoteService,
  ],
  controllers: [QuoteController],
  exports: [],
})
export class QuoteModule {}
