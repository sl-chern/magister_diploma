import { QuoteRepository } from "src/database/quote-database/repository/quote.repository";
import { BadRequestException, Injectable } from "@nestjs/common";
import { GetQuotesDto } from "src/packages/quote/dto/get-quotes.dto";
import { CreateQuoteDto } from "src/packages/quote/dto/create-quote.dto";
import { UserPrincipal } from "@repo/auth";
import { TagRepository } from "src/database/quote-database/repository/tag.repository";
import { In } from "typeorm";
import { RepostRepository } from "src/database/quote-database/repository/repost.repository";

@Injectable()
export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly tagRepository: TagRepository,
    private readonly repostRepository: RepostRepository,
  ) {}

  async getQuotes(getQuotesDto: GetQuotesDto) {
    const query = this.quoteRepository.createQueryBuilder("quotes");

    query.innerJoinAndSelect("quotes.author", "author");
    query.innerJoinAndSelect("quotes.tags", "tags");
    query.leftJoinAndSelect("quotes.repostedPost", "repostedPost");

    query.loadRelationCountAndMap("quotes.likes", "quotes.likes");
    query.loadRelationCountAndMap("quotes.reposts", "quotes.reposts");

    query.where("1=1");

    if (getQuotesDto.quoteId)
      query.andWhere("quotes.id = :id", { id: getQuotesDto.quoteId });

    if (getQuotesDto.authorId)
      query.andWhere("author.id = :authorId", {
        authorId: getQuotesDto.authorId,
      });

    if (getQuotesDto.repostedPostId)
      query.andWhere("repostedPost.postId = :postId", {
        postId: getQuotesDto.repostedPostId,
      });

    if (getQuotesDto.tags)
      query.andWhere("tags.id IN (:...tags)", { tags: getQuotesDto.tags });

    query.limit(getQuotesDto.limit);
    query.skip(getQuotesDto.offset);

    return query.getMany();
  }

  async deleteQuote(quoteId: string) {
    return await this.quoteRepository.delete({ id: quoteId });
  }

  async createQuote(createQuoteDto: CreateQuoteDto) {
    let quote = this.quoteRepository.create({
      text: createQuoteDto.text,
      history: createQuoteDto.history,
      author: createQuoteDto.author,
    });

    if (createQuoteDto.tags) {
      const tags = await this.tagRepository.find({
        where: {
          name: In(createQuoteDto.tags),
        },
      });
      quote.tags = tags;
    }

    quote = await this.quoteRepository.save(quote);

    if (createQuoteDto.repost) {
      const repostedPost = await this.quoteRepository.findOne({
        where: {
          id: createQuoteDto.repost,
        },
      });

      if (repostedPost) {
        const repost = await this.repostRepository.findOne({
          where: {
            post: repostedPost,
          },
        });

        if (repost) {
          repost.repostedBy.push(quote);
          await this.repostRepository.save(repost);
        } else {
          const newRepost = this.repostRepository.create({
            post: repostedPost,
            repostedBy: [quote],
          });
          await this.repostRepository.save(newRepost);
        }
      }
    }

    const createdQuote = await this.quoteRepository.findOne({
      where: {
        id: quote.id,
      },
      relations: ["author", "tags", "likes", "reposts", "repostedPost"],
    });

    return createdQuote;
  }
}
