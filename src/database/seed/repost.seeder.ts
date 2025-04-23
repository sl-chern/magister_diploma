import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { QuoteEntity } from "../entity/quote.entity";
import { RepostEntity } from "../entity/repost.entity";

export default class RepostSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('TRUNCATE "repost" RESTART IDENTITY;');

    const repostRepository = dataSource.getRepository(RepostEntity);
    const quoteRepository = dataSource.getRepository(QuoteEntity);

    const quotes = await quoteRepository.find();

    quotes.forEach((quote) => {
      if (Math.random() > 0.5) {
        const repostsAmount = Math.floor(Math.random() * 5);
        const sortedArray = quotes.sort(() => 0.5 - Math.random());
        repostRepository.insert({
          post: quote,
          repostedBy: sortedArray.slice(0, repostsAmount),
        });
      }
    });
  }
}
