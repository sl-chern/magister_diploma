import {
  All,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { GatewayService } from "./gateway.service";
import { GetQuotesDto } from "src/packages/quote/dto/get-quotes.dto";

@Controller("/")
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get("/messages")
  async getAllMessages(
    @Query("sender") senderId: string,
    @Query("reciever") recieverId: string,
  ) {
    return this.gatewayService.getMessages(senderId, recieverId);
  }

  @Get("/messages/:id")
  async getMessage(@Param("id") messageId: string) {
    return this.gatewayService.getMessage(messageId);
  }

  @Post("/quote")
  async getQuotes(@Body() body: GetQuotesDto) {
    return this.gatewayService.getQuotes(body);
  }

  @Get("/user/profile/:id")
  async getUserProfile(@Param() id: string) {
    return this.gatewayService.getUserProfile(id);
  }

  @All("*path")
  proxyRequest(@Req() req: Request, @Body() body: any) {
    return this.gatewayService.proxyRequest(req, body);
  }
}
