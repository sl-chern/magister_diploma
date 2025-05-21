import { Module } from "@nestjs/common";
import { QuoteRepository } from "src/database/quote-database/repository/quote.repository";
import { RepostRepository } from "src/database/quote-database/repository/repost.repository";
import { TagRepository } from "src/database/quote-database/repository/tag.repository";
import { QuoteController } from "src/packages/quote/quote.controller";
import { QuoteService } from "src/packages/quote/quote.service";

@Module({
  providers: [QuoteRepository, TagRepository, RepostRepository, QuoteService],
  controllers: [QuoteController],
  exports: [],
})
export class QuoteModule {}
