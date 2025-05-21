import {
  All,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { GatewayService } from "./gateway.service";
import { MessageEntity } from "src/database/other-database/entity/message.entity";
import { UserEntity } from "src/database/user-database/entity/user.entity";
import { GetQuotesDto } from "src/packages/quote/dto/get-quotes.dto";
import { QuoteEntity } from "src/database/quote-database/entity/quote.entity";
import { NotificationEntity } from "src/database/other-database/entity/notification.entity";

const userServiceUrl = `http://${process.env.USER_SERVICE_HOST}:${process.env.SERVICE_PORT}/api/v1/user`;
const otherServiceUrl = `http://${process.env.OTHER_SERVICES_HOST}:${process.env.SERVICE_PORT}/api/v1`;
const quoteServiceUrl = `http://${process.env.QUOTE_SERVICES_HOST}:${process.env.SERVICE_PORT}/api/v1/quote`;

@Controller("/")
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get("/messages")
  async getAllMessages(
    @Query("sender") senderId: string,
    @Query("reciever") recieverId: string,
  ) {
    const senderResponse = await fetch(`${userServiceUrl}/${senderId}`);
    const recieverResponse = await fetch(`${userServiceUrl}/${recieverId}`);
    const messagesResponse = await fetch(
      `${otherServiceUrl}/messages?sender=${senderId}&reciever=${recieverId}`,
    );
    return {
      messages: (await messagesResponse.json()) as MessageEntity[],
      sender: (await senderResponse.json()) as UserEntity,
      reciever: (await recieverResponse.json()) as UserEntity,
    };
  }

  @Get("/messages/:id")
  async getMessage(@Param("id") messageId: string) {
    const message = (await (
      await fetch(`${otherServiceUrl}/messages/${messageId}`)
    ).json()) as MessageEntity;
    const senderResponse = await fetch(`${userServiceUrl}/${message.sender}`);
    const recieverResponse = await fetch(
      `${userServiceUrl}/${message.recipient}`,
    );
    return {
      message,
      sender: (await senderResponse.json()) as UserEntity,
      reciever: (await recieverResponse.json()) as UserEntity,
    };
  }

  @Post("/quote")
  async getQuotes(@Body() body: GetQuotesDto) {
    const quotes = (await (
      await fetch(quoteServiceUrl, {
        method: "POST",
        body: JSON.stringify(body),
      })
    ).json()) as QuoteEntity[];

    const authorIds = quotes.map((quote) => quote.author);

    const users = (await (
      await fetch(
        `${userServiceUrl}?${authorIds.map((id) => `id=${id}`).join("&")}`,
      )
    ).json()) as UserEntity[];

    return {
      quotes,
      users,
    };
  }

  @Get("/user/profile/:id")
  async getUserProfile(@Param() id: string) {
    const user = (await (
      await fetch(`${userServiceUrl}/${id}`)
    ).json()) as UserEntity;

    const quotesBody: GetQuotesDto = {
      limit: 20,
      offset: 0,
      authorId: id,
    };
    const quotes = (await (
      await fetch(quoteServiceUrl, {
        method: "POST",
        body: JSON.stringify(quotesBody),
      })
    ).json()) as QuoteEntity[];

    const notifications = (await (
      await fetch(`${otherServiceUrl}/notifications/all/${id}`)
    ).json()) as NotificationEntity;

    return {
      user,
      quotes,
      notifications,
    };
  }

  @All("*path")
  proxyRequest(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res);
  }
}
