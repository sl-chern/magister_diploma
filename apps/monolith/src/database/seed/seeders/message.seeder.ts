import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../../entity/user.entity";
import { MessageEntity } from "../../entity/message.entity";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

export default class MessageSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "message" RESTART IDENTITY CASCADE;');

    const userRepository = dataSource.getRepository(UserEntity);
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
                recipient: reciever,
                sender: sender,
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
