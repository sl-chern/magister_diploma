import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class RefreshDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
