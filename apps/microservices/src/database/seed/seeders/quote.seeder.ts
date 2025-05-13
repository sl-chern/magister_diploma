import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../../entity/user.entity";
import { QuoteEntity } from "../../entity/quote.entity";
import { TagEntity } from "../../entity/tag.entity";

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

    const tagFactory = factoryManager.get(TagEntity);
    const quoteFactory = factoryManager.get(QuoteEntity);

    const users = await userRepository.find();
    const tags = await tagFactory.saveMany(500);

    for (const author of users) {
      const shuffled = tags.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      await quoteFactory.saveMany(100, {
        author,
        tags: selected,
      });
    }
  }
}
