import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "src/packages/auth/auth.service";
import { UserService } from "src/packages/user/user.service";
import { LoginDto } from "src/packages/auth/dto/login.dto";
import { RegistrationDto } from "src/packages/auth/dto/registration.dto";
import { type Request, type Response } from "express";
import jwtConfig from "src/config/jwt.config";
import { type ConfigType } from "@nestjs/config";
import {
  cookiesNames,
  permissionType,
  jwtExpToMilliseconds,
} from "@repo/utilities";
import {
  type UserPrincipal,
  ReqUser,
  JwtPayload,
  REFRESH_TOKEN_TTL,
  HasPermissionsGuard,
  JwtAuthGuard,
  HasPermissions,
} from "@repo/auth";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY)
    private jwtCfg: ConfigType<typeof jwtConfig>,
  ) {}

  setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) => {
    res.cookie(cookiesNames.accessToken, accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: jwtExpToMilliseconds(this.jwtCfg.signOptions.expiresIn),
    });
    res.cookie(cookiesNames.refreshToken, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: REFRESH_TOKEN_TTL,
    });
  };

  removeAuthCookies = (res: Response) => {
    res.clearCookie(cookiesNames.accessToken, {
      httpOnly: true,
      secure: true,
    });
    res.clearCookie(cookiesNames.refreshToken, {
      httpOnly: true,
      secure: true,
    });
  };

  @Post("login")
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const loginInfo = await this.authService.login(body);
    this.setAuthCookies(res, loginInfo.accessToken, loginInfo.refreshToken);
    return res.json(loginInfo.userInfo);
  }

  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req?.cookies?.refresh_token)
        throw new BadRequestException("Token not exist");

      const decoded = JSON.parse(
        atob(req.cookies.refresh_token as string),
      ) as JwtPayload;

      const tokens = await this.authService.refresh({
        id: decoded.id!,
        refresh_token: req.cookies.refresh_token as string,
      });

      this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      return res.json(true);
    } catch (err) {
      this.removeAuthCookies(res);
      throw err;
    }
  }

  @Post("registration")
  async registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("verify")
  async verifyUser(@ReqUser() user: UserPrincipal) {
    return this.userService.findByEmail(user.email!);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@ReqUser() user: UserPrincipal, @Res() res: Response) {
    await this.authService.logout(user.id!);
    this.removeAuthCookies(res);
    return true;
  }

  @UseGuards(JwtAuthGuard, HasPermissionsGuard)
  @HasPermissions(permissionType.readPosts)
  @Get(":email")
  async getUserByEmail(@Param("email") email: string) {
    return this.userService.findByEmail(email);
  }
}
