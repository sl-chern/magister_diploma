import {
  IsUUID,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from "class-validator";

export class GetQuotesDto {
  @IsUUID()
  @IsOptional()
  quoteId?: string;

  @IsUUID()
  @IsOptional()
  authorId?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsUUID()
  @IsOptional()
  repostedPostId?: string[];

  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsNumber()
  offset: number;
}
