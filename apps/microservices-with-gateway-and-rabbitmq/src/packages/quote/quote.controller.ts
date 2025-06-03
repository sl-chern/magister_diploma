import { Controller } from "@nestjs/common";
import { QuoteService } from "src/packages/quote/quote.service";
import { GetQuotesDto } from "src/packages/quote/dto/get-quotes.dto";
import { CreateQuoteDto } from "src/packages/quote/dto/create-quote.dto";
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
    body: CreateQuoteDto,
  ) {
    return await this.quoteService.createQuote(body);
  }

  @MessagePattern("getQuote")
  async getQuote(@Payload() body: { id: string }) {
    return await this.quoteService.getQuotes({
      limit: 1,
      offset: 0,
      quoteId: body.id,
    });
  }

  @MessagePattern("deleteQuote")
  async deleteQuote(@Payload() body: { id: string }) {
    return await this.quoteService.deleteQuote(body.id);
  }
}
