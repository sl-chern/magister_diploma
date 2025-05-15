import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GatewayController } from "src/packages/gateway/gateway.controller";
import { GatewayService } from "src/packages/gateway/gateway.service";
import { AppLoggerMiddleware } from "src/middlewares/app-logger.middleware";
import { RabbitMQModule } from "src/packages/rabbitmq/rabbitmq.module";

@Module({
  imports: [ConfigModule.forRoot({ ignoreEnvFile: true }), RabbitMQModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes("*path");
  }
}
