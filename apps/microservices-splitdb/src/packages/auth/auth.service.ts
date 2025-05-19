import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { PermissionRepository } from "src/database/user-database/repository/permission.repository";
import { UserRepository } from "src/database/user-database/repository/user.repository";
import { RedisService } from "@repo/redis";
import { REFRESH_TOKEN_TTL, JwtPayload } from "@repo/auth";
import { RefreshDto } from "src/packages/auth/dto/refresh.dto";
import { LoginDto } from "src/packages/auth/dto/login.dto";
import { RegistrationDto } from "src/packages/auth/dto/registration.dto";
import { TokensReturnDto } from "src/packages/auth/dto/tokens-return.dto";
import { LoginReturnDto } from "src/packages/auth/dto/login-return.dto";
import { UserEntity } from "src/database/user-database/entity/user.entity";
import { permissionType, Optional } from "@repo/utilities";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly redisService: RedisService,
  ) {}

  async getTokens(payload: JwtPayload): Promise<TokensReturnDto> {
    const accessToken = await this.jwtService.signAsync(payload);
    const randomUUId = crypto.randomUUID();
    const refreshToken = btoa(
      JSON.stringify({ ...payload, token: randomUUId }),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginInput: LoginDto): Promise<LoginReturnDto> {
    const user = (await this.userRepository.findByEmail(
      loginInput.email.toLowerCase(),
    )) as Optional<UserEntity, "password" | "is_confirmed">;

    if (!user) throw new BadRequestException("User does not exist");

    if (!user.is_confirmed)
      throw new ForbiddenException(`The user's email is not confirmed`);
    if (!user.password)
      throw new BadRequestException("Password does not exist");

    const passwordsCompairing = await bcrypt.compare(
      loginInput.password,
      user.password,
    );
    if (!passwordsCompairing)
      throw new BadRequestException("Incorrect password");

    const userInfo = { ...user };

    delete userInfo.password;
    delete userInfo.is_confirmed;

    const tokens = await this.getTokens({
      email: userInfo.email,
      name: userInfo.name,
      permissions: userInfo.permissions.map((permission) => permission.name),
    });

    await this.updateRefreshToken(userInfo.id, tokens.refreshToken);
    return {
      ...tokens,
      userInfo,
    };
  }

  async refresh(refreshInput: RefreshDto): Promise<TokensReturnDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: refreshInput.id,
      },
      relations: ["permissions"],
    });
    if (!user || !refreshInput.refresh_token)
      throw new BadRequestException("User does not exist");

    const currentRefreshToken = await this.redisService.get(user.id.toString());
    if (currentRefreshToken !== refreshInput.refresh_token)
      throw new ForbiddenException("Access Denied");

    const tokens = await this.getTokens({
      email: user.email,
      name: user.name,
      permissions: user.permissions.map((permission) => permission.name),
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new BadRequestException("User does not exist");
    await this.redisService.delete(user.id.toString());
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.redisService.set(id.toString(), refreshToken, REFRESH_TOKEN_TTL);
  }

  async registration(registrationInput: RegistrationDto) {
    const { email, name, password } = registrationInput;
    const hashedPassword = await bcrypt.hash(password, 5);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser)
      throw new BadRequestException("User with this email exists");

    let user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      is_confirmed: true,
    });

    user = await this.userRepository.save(user);
    const permissions = await this.permissionRepository.findByNames([
      permissionType.readPosts,
    ]);
    user.permissions = permissions;

    return this.userRepository.save(user);
  }
}
