import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GatewayController } from "src/packages/gateway/gateway.controller";
import { GatewayService } from "./gateway.service";
import { AppLoggerMiddleware } from "src/middlewares/app-logger.middleware";

@Module({
  imports: [ConfigModule.forRoot({ ignoreEnvFile: true })],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes("*path");
  }
}
