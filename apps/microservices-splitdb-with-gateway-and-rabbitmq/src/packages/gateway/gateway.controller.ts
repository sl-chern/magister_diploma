import { All, Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { GatewayService } from "./gateway.service";
import { GetQuotesDto } from "src/packages/quote/dto/get-quotes.dto";

@Controller("/")
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get("/messages/getMessages")
  async getAllMessages(@Body() body: { senderId: string; recieverId: string }) {
    return this.gatewayService.getMessages(body.senderId, body.recieverId);
  }

  @Get("/messages/getMessage")
  async getMessage(@Body() body: { id: string }) {
    return this.gatewayService.getMessage(body.id);
  }

  @Post("/quote/getQuotes")
  async getQuotes(@Body() body: GetQuotesDto) {
    return this.gatewayService.getQuotes(body);
  }

  @Get("/user/getProfile")
  async getUserProfile(@Body() body: { id: string }) {
    return this.gatewayService.getUserProfile(body.id);
  }

  @All("*path")
  proxyRequest(@Req() req: Request, @Body() body: any) {
    return this.gatewayService.proxyRequest(req, body);
  }
}
