import { UserEntity } from "@/database/entity/user.entity";

export class LoginReturnDto {
  accessToken: string;
  refreshToken: string;
  userInfo: Partial<UserEntity>;
}
