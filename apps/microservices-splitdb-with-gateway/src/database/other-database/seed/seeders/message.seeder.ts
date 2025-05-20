import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";
import { MessageEntity } from "../../entity/message.entity";
import { UserEntity } from "../../../user-database/entity/user.entity";
import { RoleEntity } from "../../../user-database/entity/role.entity";
import { PermissionEntity } from "../../../user-database/entity/permission.entity";

export default class MessageSeeder implements Seeder {
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

    await dataSource.query('TRUNCATE "message" RESTART IDENTITY CASCADE;');

    const userRepository = userDbDataSource.getRepository(UserEntity);

    const users = await userRepository.find();

    const messageFactory = factoryManager.get(MessageEntity);

    for (const reciever of users) {
      for (const sender of users) {
        await messageFactory.saveMany(5, {
          recipient: reciever.id,
          sender: sender.id,
        });
      }
    }
  }
}
