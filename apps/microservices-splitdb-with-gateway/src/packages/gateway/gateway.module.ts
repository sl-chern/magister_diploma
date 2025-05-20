import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GatewayController } from "src/packages/gateway/gateway.controller";
import { GatewayService } from "./gateway.service";

@Module({
  imports: [ConfigModule.forRoot({ ignoreEnvFile: true })],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
