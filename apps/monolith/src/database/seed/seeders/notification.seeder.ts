import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../../entity/user.entity";
import { NotificationEntity } from "../../entity/notification.entity";

export default class NotificationSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "notification" RESTART IDENTITY CASCADE;');

    const userRepository = dataSource.getRepository(UserEntity);

    const users = await userRepository.find();

    const notificationFactory = factoryManager.get(NotificationEntity);

    console.log("fuck");

    for (let i = 0; i < 300; i++) {
      const shuffled = users.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 25);
      await notificationFactory.save({
        users: selected,
      });
    }
  }
}
