import { Module } from "@nestjs/common";
import { QuoteRepository } from "@/database/repository/quote.repository";
import { QuoteController } from "@/packages/quote/quote.controller";
import { QuoteService } from "@/packages/quote/quote.service";
import { UserRepository } from "@/database/repository/user.repository";
import { TagRepository } from "@/database/repository/tag.repository";
import { RepostRepository } from "@/database/repository/repost.repository";

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
