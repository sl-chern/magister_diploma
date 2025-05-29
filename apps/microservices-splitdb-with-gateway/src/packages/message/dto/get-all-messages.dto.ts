import { IsNotEmpty } from "class-validator";

export class GetAllMessagesDto {
  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  recieverId: string;
}
