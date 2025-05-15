import { BadRequestException, Controller, Inject } from "@nestjs/common";
import { AuthService } from "src/packages/auth/auth.service";
import { UserService } from "src/packages/user/user.service";
import { LoginDto } from "src/packages/auth/dto/login.dto";
import { RegistrationDto } from "src/packages/auth/dto/registration.dto";
import jwtConfig from "src/config/jwt.config";
import { type ConfigType } from "@nestjs/config";
import { type UserPrincipal, JwtPayload } from "@repo/auth";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TokensReturnDto } from "src/packages/auth/dto/tokens-return.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY)
    private jwtCfg: ConfigType<typeof jwtConfig>,
  ) {}

  @MessagePattern("login")
  async login(@Payload() body: LoginDto) {
    return await this.authService.login(body);
  }

  @MessagePattern("refresh")
  async refresh(@Payload() body: TokensReturnDto) {
    if (!body.refreshToken) throw new BadRequestException("Token not exist");

    const decoded = JSON.parse(atob(body.refreshToken)) as JwtPayload;

    return await this.authService.refresh({
      id: decoded.id,
      refresh_token: body.refreshToken,
    });
  }

  @MessagePattern("registration")
  async registration(@Payload() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto);
  }

  @MessagePattern("verify")
  async verifyUser(@Payload() user: UserPrincipal) {
    return this.userService.findByEmail(user.email);
  }

  @MessagePattern("logout")
  async logout(@Payload() user: UserPrincipal) {
    await this.authService.logout(user.id);
  }
}
