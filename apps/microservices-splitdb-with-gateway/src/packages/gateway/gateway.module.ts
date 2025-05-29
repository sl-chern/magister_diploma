import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GatewayController } from "src/packages/gateway/gateway.controller";
import { GatewayService } from "./gateway.service";
import { json } from "express";

@Module({
  imports: [ConfigModule.forRoot({ ignoreEnvFile: true })],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(json())
      .forRoutes(
        { path: "/messages", method: RequestMethod.GET },
        { path: "/messages/:id", method: RequestMethod.GET },
        { path: "/quote", method: RequestMethod.POST },
        { path: "/user/profile/:id", method: RequestMethod.GET },
      );
  }
}
