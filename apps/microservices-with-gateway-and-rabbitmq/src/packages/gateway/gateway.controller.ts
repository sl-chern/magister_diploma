import { All, Body, Controller, Req } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { Request } from "express";

@Controller("/")
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @All("*path")
  proxyRequest(@Body() body: any, @Req() req: Request) {
    return this.gatewayService.proxyRequest(req, body);
  }
}
