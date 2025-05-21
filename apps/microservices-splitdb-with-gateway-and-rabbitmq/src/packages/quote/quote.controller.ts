import { Controller } from "@nestjs/common";
import { QuoteService } from "src/packages/quote/quote.service";
import { GetQuotesDto } from "src/packages/quote/dto/get-quotes.dto";
import { CreateQuoteDto } from "src/packages/quote/dto/create-quote.dto";
import { type UserPrincipal } from "@repo/auth";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("quote")
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @MessagePattern("getQuotes")
  async getQuotes(@Payload() body: GetQuotesDto) {
    return await this.quoteService.getQuotes(body);
  }

  @MessagePattern("createQuote")
  async createQuote(
    @Payload()
    body: {
      body: CreateQuoteDto;
      user: UserPrincipal;
    },
  ) {
    return await this.quoteService.createQuote(body.body, body.user);
  }

  @MessagePattern("getQuote")
  async getQuote(@Payload() quoteId: string) {
    return await this.quoteService.getQuotes({
      limit: 1,
      offset: 1,
      quoteId: quoteId,
    });
  }

  @MessagePattern("deleteQuote")
  async deleteQuote(@Payload() quoteId: string) {
    return await this.quoteService.deleteQuote(quoteId);
  }
}
