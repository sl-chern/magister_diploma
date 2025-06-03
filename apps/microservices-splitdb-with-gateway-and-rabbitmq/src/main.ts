import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import { UserServiceModule } from "src/user-service.module";
import { QuoteServiceModule } from "src/quote-service.module";
import { OtherServicesModule } from "src/other-services.module";
import { serviceType } from "@repo/utilities";
import { GatewayModule } from "src/packages/gateway/gateway.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  configDotenv({ path: ".env.dev" });
  let module;
  switch (process.env.SERVICE_TYPE) {
    case serviceType.gateway:
      module = GatewayModule;
      break;
    case serviceType.user:
      module = UserServiceModule;
      break;
    case serviceType.quote:
      module = QuoteServiceModule;
      break;
    case serviceType.other:
      module = OtherServicesModule;
      break;
    default:
      throw new Error("Uknown service type");
  }
  const app = await NestFactory.create<NestExpressApplication>(module);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: `http://localhost:3000`,
    credentials: true,
  });
  app.setGlobalPrefix("api/v1");
  await app.listen(process.env.BACKEND_PORT);

  if (process.env.SERVICE_TYPE !== serviceType.gateway) {
    const microservice = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI],
        queue: `${process.env.SERVICE_TYPE}_queue`,
        queueOptions: { durable: false },
      },
    });
    await microservice.listen();
  }
}
bootstrap();
