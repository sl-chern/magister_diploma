import { BadRequestException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { createProxyServer } from "http-proxy";
import { controllerName } from "@repo/utilities";

const proxy = createProxyServer({});

@Injectable()
export class GatewayService {
  proxyRequest(req: Request, res: Response) {
    const url = req.url;
    const controllerNameInUrl = url.split("/")[3].split("?")[0];
    let target = "";

    switch (controllerNameInUrl) {
      case controllerName.user:
      case controllerName.auth:
        target = `http://${process.env.USER_SERVICE_HOST}:${process.env.SERVICE_PORT}`;
        break;
      case controllerName.quote:
        target = `http://${process.env.QUOTE_SERVICE_HOST}:${process.env.SERVICE_PORT}`;
        break;
      case controllerName.message:
      case controllerName.notification:
        target = `http://${process.env.OTHER_SERVICES_HOST}:${process.env.SERVICE_PORT}`;
        break;
      default:
        throw new BadRequestException("Gateway error");
    }

    proxy.web(req, res, { target, changeOrigin: true }, (error) => {
      res.status(500).json({ error: "Gateway error", message: error.message });
    });
  }
}
