import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";
import { QuoteEntity } from "../../entity/quote.entity";
import { TagEntity } from "../../entity/tag.entity";
import { UserEntity } from "../../../user-database/entity/user.entity";
import { RoleEntity } from "../../../user-database/entity/role.entity";
import { PermissionEntity } from "../../../user-database/entity/permission.entity";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

export default class QuoteSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userDbDataSource = new DataSource({
      type: process.env.DB_TYPE || "postgres",
      host: process.env.DB_LOCAL_HOST || "localhost",
      port: +(process.env.DB_USER_PORT || 5433),
      database: process.env.DB_USER_NAME || "db",
      username: process.env.DB_USERNAME || "pguser",
      password: process.env.DB_PASSWORD || "pguser",
      entities: [UserEntity, RoleEntity, PermissionEntity],
      logging: false,
    } as DataSourceOptions);

    await userDbDataSource.initialize();

    await dataSource.query(
      'TRUNCATE "quote_tags_tag" RESTART IDENTITY CASCADE;',
    );
    await dataSource.query('TRUNCATE "quote" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "tag" RESTART IDENTITY CASCADE;');

    const userRepository = userDbDataSource.getRepository(UserEntity);
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
              author: author.id,
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
