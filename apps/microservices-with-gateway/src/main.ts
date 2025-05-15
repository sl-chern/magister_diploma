import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import { UserServiceModule } from "src/user-service.module";
import { QuoteServiceModule } from "src/quote-service.module";
import { OtherServicesModule } from "src/other-services.module";
import { GatewayModule } from "src/packages/gateway/gateway.module";

async function bootstrap() {
  configDotenv({ path: ".env.dev" });
  let module;
  switch (process.env.SERVICE_TYPE) {
    case "gateway":
      module = GatewayModule;
      break;
    case "user":
      module = UserServiceModule;
      break;
    case "quote":
      module = QuoteServiceModule;
      break;
    case "other":
      module = OtherServicesModule;
      break;
    default:
      throw new Error("Uknown service type");
  }
  const app = await NestFactory.create<NestExpressApplication>(module, {
    bodyParser: process.env.SERVICE_TYPE !== "gateway",
  });
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
}
bootstrap();
