import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../../entity/user.entity";
import { NotificationEntity } from "../../entity/notification.entity";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

export default class NotificationSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "notification" RESTART IDENTITY CASCADE;');

    const userRepository = dataSource.getRepository(UserEntity);

    const users = await userRepository.find();

    const notificationFactory = factoryManager.get(NotificationEntity);

    const notificationRepository = dataSource.getRepository(NotificationEntity);

    const csvContent = readFileSync("data/notification.csv", "utf-8");

    const partialNotificationData = (await parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    })) as {
      notificationId: string;
    }[];

    const notificationsData: NotificationEntity[] = [];

    for (const partialNotification of partialNotificationData) {
      const shuffled = users.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 25);
      notificationsData.push(
        await notificationFactory.make(
          {
            id: partialNotification.notificationId,
            users: selected,
          },
          false,
        ),
      );
    }

    await notificationRepository.save(notificationsData);
  }
}
