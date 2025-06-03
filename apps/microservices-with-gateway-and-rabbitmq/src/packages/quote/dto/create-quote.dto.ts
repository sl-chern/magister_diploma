export class CreateQuoteDto {
  author: string;
  text: string;
  history: string;
  repost?: string;
  tags?: string[];
}
