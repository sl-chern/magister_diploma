import { registerAs } from "@nestjs/config";
import { JwtConfig } from "@repo/utilities/src/interfaces/JwtConfig"

export default registerAs(
  "jwt",
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET!,
    signOptions: {
      expiresIn: process.env.JWT_EXPERATION_TIME!,
    },
  }),
);
