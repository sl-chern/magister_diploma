import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { QuoteEntity } from "../entity/quote.entity";
import { LikeEntity } from "../entity/like.entity";

export default class LikeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('TRUNCATE "like" RESTART IDENTITY CASCADE;');

    const likeRepository = dataSource.getRepository(LikeEntity);
    const userRepository = dataSource.getRepository(UserEntity);
    const quoteRepository = dataSource.getRepository(QuoteEntity);

    const users = await userRepository.find();
    const quotes = await quoteRepository.find();

    for (const user of users) {
      for (const quote of quotes) {
        if (Math.random() > 0.5) await likeRepository.insert({ quote, user });
      }
    }
  }
}
