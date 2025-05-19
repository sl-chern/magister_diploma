import { Seeder } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";
import { QuoteEntity } from "../../entity/quote.entity";
import { LikeEntity } from "../../entity/like.entity";
import { UserEntity } from "../../../user-database/entity/user.entity";
import { RoleEntity } from "../../../user-database/entity/role.entity";
import { PermissionEntity } from "../../../user-database/entity/permission.entity";

export default class LikeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
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

    await dataSource.query('TRUNCATE "like" RESTART IDENTITY CASCADE;');

    const likeRepository = dataSource.getRepository(LikeEntity);
    const userRepository = userDbDataSource.getRepository(UserEntity);
    const quoteRepository = dataSource.getRepository(QuoteEntity);

    const users = await userRepository.find();
    const quotes = await quoteRepository.find();

    const likes: Partial<LikeEntity>[] = [];

    for (const user of users) {
      for (const quote of quotes) {
        if (Math.random() > 0.5) likes.push({ quote, user: user.id });
      }
    }

    const chunkSize = 10000;
    for (let i = 0; i < likes.length; i += chunkSize) {
      const chunk = likes.slice(i, i + chunkSize);
      await likeRepository.insert(chunk);
    }
  }
}
