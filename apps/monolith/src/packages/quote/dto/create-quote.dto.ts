import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateQuoteDto {
  @IsNotEmpty()
  text: string;

  @IsOptional()
  userId?: string;

  @IsNotEmpty()
  history: string;

  @IsOptional()
  repost?: string;

  @IsOptional()
  tags?: string[];
}
