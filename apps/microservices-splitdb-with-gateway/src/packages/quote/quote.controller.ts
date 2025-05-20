import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { QuoteService } from "src/packages/quote/quote.service";
import { GetQuotesDto } from "src/packages/quote/dto/get-quotes.dto";
import { CreateQuoteDto } from "src/packages/quote/dto/create-quote.dto";

@Controller("quote")
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async getQuotes(@Body() body: GetQuotesDto) {
    return await this.quoteService.getQuotes(body);
  }

  @Post("create")
  async createQuote(@Body() body: CreateQuoteDto) {
    return await this.quoteService.createQuote(body);
  }

  @Get()
  async getQuote(@Param("quoteId") quoteId: string) {
    return await this.quoteService.getQuotes({
      limit: 1,
      offset: 1,
      quoteId: quoteId,
    });
  }

  @Delete()
  async deleteQuote(@Param("quoteId") quoteId: string) {
    return await this.quoteService.deleteQuote(quoteId);
  }
}
