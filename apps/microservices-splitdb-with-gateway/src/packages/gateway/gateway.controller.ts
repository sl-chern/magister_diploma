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
const quoteServiceUrl = `http://${process.env.QUOTE_SERVICE_HOST}:${process.env.SERVICE_PORT}/api/v1/quote`;

@Controller("/")
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get("/messages")
  async getAllMessages(
    @Query("sender") senderId: string,
    @Query("reciever") recieverId: string,
  ) {
    const senderPromise = fetch(`${userServiceUrl}/${senderId}`);
    const recieverPromise = fetch(`${userServiceUrl}/${recieverId}`);
    const messagesPromise = fetch(
      `${otherServiceUrl}/messages?sender=${senderId}&reciever=${recieverId}`,
    );

    const responses = await Promise.all([
      senderPromise,
      recieverPromise,
      messagesPromise,
    ]);

    return {
      messages: (await responses[0].json()) as MessageEntity[],
      sender: (await responses[1].json()) as UserEntity,
      reciever: (await responses[2].json()) as UserEntity,
    };
  }

  @Get("/messages/:id")
  async getMessage(@Param("id") messageId: string) {
    try {
      const messageResponse = await fetch(
        `${otherServiceUrl}/messages/${messageId}`,
      );

      if (messageResponse.status !== 500) {
        const message = (await messageResponse.json()) as MessageEntity;

        const senderPromise = fetch(`${userServiceUrl}/${message.sender}`);
        const recieverPromise = fetch(`${userServiceUrl}/${message.recipient}`);

        const responces = await Promise.all([senderPromise, recieverPromise]);

        return {
          message,
          sender: (await responces[0].json()) as UserEntity,
          reciever: (await responces[1].json()) as UserEntity,
        };
      }
      return {};
    } catch {
      return {};
    }
  }

  @Post("/quote")
  async getQuotes(@Body() body: GetQuotesDto) {
    const quotes = (await (
      await fetch(quoteServiceUrl, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json()) as QuoteEntity[];

    const authorIds = quotes.map((quote) => quote.author);

    const users = (await (
      await fetch(
        `${userServiceUrl}?${authorIds.map((id) => `id=${id}`).join("&")}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    ).json()) as UserEntity[];

    return {
      quotes,
      users,
    };
  }

  @Get("/user/profile/:id")
  async getUserProfile(@Param("id") id: string) {
    const userPromise = fetch(`${userServiceUrl}/${id}`);

    const quotesBody: GetQuotesDto = {
      limit: 20,
      offset: 0,
      authorId: id,
    };
    const quotesPromise = fetch(quoteServiceUrl, {
      method: "POST",
      body: JSON.stringify(quotesBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const notificationsPromise = fetch(
      `${otherServiceUrl}/notifications/all/${id}`,
    );

    const responces = await Promise.all([
      userPromise,
      quotesPromise,
      notificationsPromise,
    ]);

    return {
      user: (await responces[0].json()) as UserEntity,
      quotes: (await responces[1].json()) as QuoteEntity[],
      notifications: (await responces[2].json()) as NotificationEntity[],
    };
  }

  @All("*path")
  proxyRequest(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res);
  }
}
