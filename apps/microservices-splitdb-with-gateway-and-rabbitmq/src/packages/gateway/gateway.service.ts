import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Request } from "express";
import { controllerName } from "@repo/utilities";
import { ClientProxy } from "@nestjs/microservices";
import { QuoteEntity } from "src/database/quote-database/entity/quote.entity";
import { GetQuotesDto } from "src/packages/quote/dto/get-quotes.dto";
import { NotificationEntity } from "src/database/other-database/entity/notification.entity";
import { MessageEntity } from "src/database/other-database/entity/message.entity";
import { UserEntity } from "src/database/user-database/entity/user.entity";

@Injectable()
export class GatewayService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    @Inject("QUOTE_SERVICE") private readonly quoteClient: ClientProxy,
    @Inject("OTHER_SERVICES") private readonly otherClient: ClientProxy,
  ) {}

  async getMessages(senderId: string, recieverId: string) {
    const senderPromise = this.userClient
      .send<UserEntity>("getUser", senderId)
      .toPromise();

    const recieverPromise = this.userClient
      .send<UserEntity>("getUser", recieverId)
      .toPromise();

    const messagesPromise = this.otherClient
      .send<MessageEntity>("getMessages", {
        senderId,
        recieverId,
      })
      .toPromise();

    const results = await Promise.all([
      senderPromise,
      recieverPromise,
      messagesPromise,
    ]);

    return {
      sender: results[0],
      reciever: results[1],
      messages: results[2],
    };
  }

  async getMessage(id: string) {
    const message = await this.otherClient
      .send<MessageEntity>("getMessage", id)
      .toPromise();

    const senderPromise = this.userClient
      .send<UserEntity>("getUser", message.sender)
      .toPromise();

    const recieverPromise = this.userClient
      .send<UserEntity>("getUser", message.recipient)
      .toPromise();

    const results = await Promise.all([senderPromise, recieverPromise]);

    return {
      sender: results[0],
      reciever: results[1],
      message,
    };
  }

  async getQuotes(body: GetQuotesDto) {
    const quotes = await this.quoteClient
      .send<QuoteEntity[]>("getQuotes", body)
      .toPromise();

    const authorIds = quotes.map((quote) => quote.author);

    const users = await this.userClient
      .send<UserEntity>("getUsers", {
        ids: authorIds,
      })
      .toPromise();

    return {
      quotes,
      users,
    };
  }

  async getUserProfile(id: string) {
    const userPromise = this.userClient
      .send<UserEntity>("getProfile", id)
      .toPromise();

    const quotesBody: GetQuotesDto = {
      limit: 20,
      offset: 0,
      authorId: id,
    };

    const quotesPromise = this.quoteClient
      .send<QuoteEntity[]>("getQuotes", quotesBody)
      .toPromise();

    const notificationsPromise = this.otherClient
      .send<NotificationEntity[]>("findNotifications", { id })
      .toPromise();

    const results = await Promise.all([
      userPromise,
      quotesPromise,
      notificationsPromise,
    ]);

    return {
      user: results[0],
      quotes: results[1],
      notifications: results[2],
    };
  }

  proxyRequest(req: Request, body: any) {
    const url = req.url;
    const controllerNameInUrl = url.split("/")[3];
    const messageName = url.split("/")[4];
    let targetClient: ClientProxy;

    console.log(controllerNameInUrl, messageName, body);

    switch (controllerNameInUrl) {
      case controllerName.user:
      case controllerName.auth:
        targetClient = this.userClient;
        break;
      case controllerName.quote:
        targetClient = this.quoteClient;
        break;
      case controllerName.message:
      case controllerName.notification:
        targetClient = this.otherClient;
        break;
      default:
        throw new BadRequestException("Gateway error");
    }

    console.log(targetClient);

    return targetClient.send(messageName, body);
  }
}
