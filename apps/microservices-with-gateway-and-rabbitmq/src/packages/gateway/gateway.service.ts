import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Request } from "express";
import { controllerName } from "@repo/utilities";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class GatewayService {
  constructor(
    @Inject("USER_SERVICE") private readonly userClient: ClientProxy,
    @Inject("QUOTE_SERVICE") private readonly quoteClient: ClientProxy,
    @Inject("OTHER_SERVICES") private readonly otherClient: ClientProxy,
  ) {}

  proxyRequest(req: Request, body: any) {
    const url = req.url;
    const controllerNameInUrl = url.split("/")[3];
    const messageName = url.split("/")[4];
    let targetClient: ClientProxy;

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

    return targetClient.send(messageName, body);
  }
}
