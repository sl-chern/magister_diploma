import { UserEntity } from "src/database/user-database/entity/user.entity";

export class LoginReturnDto {
  accessToken: string;
  refreshToken: string;
  userInfo: Partial<UserEntity>;
}
