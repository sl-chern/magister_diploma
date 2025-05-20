import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";
import { QuoteEntity } from "../../entity/quote.entity";
import { TagEntity } from "../../entity/tag.entity";
import { UserEntity } from "../../../user-database/entity/user.entity";
import { RoleEntity } from "../../../user-database/entity/role.entity";
import { PermissionEntity } from "../../../user-database/entity/permission.entity";

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

    const tagFactory = factoryManager.get(TagEntity);
    const quoteFactory = factoryManager.get(QuoteEntity);

    const users = await userRepository.find();
    const tags = await tagFactory.saveMany(500);

    for (const author of users) {
      const shuffled = tags.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      await quoteFactory.saveMany(100, {
        author: author.id,
        tags: selected,
      });
    }
  }
}
