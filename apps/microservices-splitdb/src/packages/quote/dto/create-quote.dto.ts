import { IsOptional, IsNotEmpty } from "class-validator";

export class CreateQuoteDto {
  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  history: string;

  @IsOptional()
  repost?: string;

  @IsOptional()
  tags?: string[];
}
