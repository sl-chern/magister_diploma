import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";
import { NotificationEntity } from "../../entity/notification.entity";
import { UserEntity } from "../../../user-database/entity/user.entity";
import { UserNotificationEntity } from "../../entity/user-notification.entity";
import { RoleEntity } from "../../../user-database/entity/role.entity";
import { PermissionEntity } from "../../../user-database/entity/permission.entity";

export default class NotificationSeeder implements Seeder {
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

    await dataSource.query('TRUNCATE "notification" RESTART IDENTITY CASCADE;');

    const userRepository = userDbDataSource.getRepository(UserEntity);
    const userNotificationRepository = dataSource.getRepository(
      UserNotificationEntity,
    );

    const users = await userRepository.find();

    const notificationFactory = factoryManager.get(NotificationEntity);
    const notifications = await notificationFactory.saveMany(300);

    const userNotifications: Partial<UserNotificationEntity>[] = [];

    for (const notification of notifications) {
      const shuffled = users.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 25);

      selected.forEach((selectedUser) =>
        userNotifications.push({
          notification,
          userId: selectedUser.id,
        }),
      );
    }

    await userNotificationRepository.insert(userNotifications);
  }
}
