import { registerAs } from "@nestjs/config";
import { JwtConfig } from "@repo/utilities"

export default registerAs(
  "jwt",
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPERATION_TIME,
    },
  }),
);
