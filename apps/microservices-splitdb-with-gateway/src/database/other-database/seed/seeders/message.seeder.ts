import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";
import { MessageEntity } from "../../entity/message.entity";
import { UserEntity } from "../../../user-database/entity/user.entity";
import { RoleEntity } from "../../../user-database/entity/role.entity";
import { PermissionEntity } from "../../../user-database/entity/permission.entity";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

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
    const messageRepository = dataSource.getRepository(MessageEntity);

    const users = await userRepository.find();

    const messageFactory = factoryManager.get(MessageEntity);

    const csvContent = readFileSync("data/message.csv", "utf-8");

    const partialMessageData = (await parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    })) as {
      messageId: string;
    }[];

    const messageDataIterator = partialMessageData[Symbol.iterator]();

    const messages: MessageEntity[] = [];

    for (const reciever of users) {
      for (const sender of users) {
        for (let i = 0; i < 5; i++) {
          messages.push(
            await messageFactory.make(
              {
                id: messageDataIterator.next().value.messageId,
                recipient: reciever.id,
                sender: sender.id,
              },
              false,
            ),
          );
        }
      }
    }

    const chunkSize = 10000;
    for (let i = 0; i < messages.length; i += chunkSize) {
      const chunk = messages.slice(i, i + chunkSize);
      await messageRepository.insert(chunk);
    }
  }
}
