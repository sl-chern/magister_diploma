import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";

async function bootstrap() {
  configDotenv({ path: ".env.dev" });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({ origin: "http://localhost:3000", credentials: true });
  app.setGlobalPrefix("api/v1");
  await app.listen(process.env.BACKEND_PORT!);
}
bootstrap();
