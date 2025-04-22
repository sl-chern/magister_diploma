import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { QuoteEntity } from "../entity/quote.entity";
import { TagEntity } from "../entity/tag.entity";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "quote" RESTART IDENTITY;');
    await dataSource.query('TRUNCATE "tag" RESTART IDENTITY;');

    const userRepository = dataSource.getRepository(UserEntity);

    const tagFactory = factoryManager.get(TagEntity);
    const quoteFactory = factoryManager.get(QuoteEntity);

    const users = await userRepository.find();
    const tags = await tagFactory.saveMany(500);

    users.forEach((author) => {
      const shuffled = tags.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      quoteFactory.saveMany(100, {
        author,
        tags: selected,
      });
    });
  }
}
