import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GatewayController } from "src/packages/gateway/gateway.controller";
import { GatewayService } from "./gateway.service";
import { RabbitMQModule } from "src/packages/rabbitmq/rabbitmq.module";

@Module({
  imports: [ConfigModule.forRoot({ ignoreEnvFile: true }), RabbitMQModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
