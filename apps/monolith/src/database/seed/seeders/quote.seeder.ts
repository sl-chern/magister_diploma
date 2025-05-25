import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../../entity/user.entity";
import { QuoteEntity } from "../../entity/quote.entity";
import { TagEntity } from "../../entity/tag.entity";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

export default class QuoteSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query(
      'TRUNCATE "quote_tags_tag" RESTART IDENTITY CASCADE;',
    );
    await dataSource.query('TRUNCATE "quote" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "tag" RESTART IDENTITY CASCADE;');

    const userRepository = dataSource.getRepository(UserEntity);
    const quoteRepository = dataSource.getRepository(QuoteEntity);

    const tagFactory = factoryManager.get(TagEntity);
    const quoteFactory = factoryManager.get(QuoteEntity);

    const users = await userRepository.find();
    const tags = await tagFactory.saveMany(500);

    const quotes: QuoteEntity[] = [];

    const csvContent = readFileSync("data/quote.csv", "utf-8");

    const partialQuoteData = (await parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    })) as {
      quoteId: string;
    }[];

    const quoteDataIterator = partialQuoteData[Symbol.iterator]();

    for (const author of users) {
      const shuffled = tags.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      for (let i = 0; i < 100; i++) {
        quotes.push(
          await quoteFactory.make(
            {
              id: quoteDataIterator.next().value.quoteId,
              author: author,
              tags: selected,
            },
            false,
          ),
        );
      }
    }

    const chunkSize = 10000;
    for (let i = 0; i < quotes.length; i += chunkSize) {
      const chunk = quotes.slice(i, i + chunkSize);
      await quoteRepository.insert(chunk);
    }
  }
}
