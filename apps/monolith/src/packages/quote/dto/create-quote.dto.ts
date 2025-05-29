export class CreateQuoteDto {
  text: string;
  userId?: string;
  history: string;
  repost?: string;
  tags?: string[];
}
