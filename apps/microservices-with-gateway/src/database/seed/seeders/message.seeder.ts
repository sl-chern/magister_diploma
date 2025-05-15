import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../../entity/user.entity";
import { MessageEntity } from "../../entity/message.entity";

export default class MessageSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "message" RESTART IDENTITY CASCADE;');

    const userRepository = dataSource.getRepository(UserEntity);

    const users = await userRepository.find();

    const messageFactory = factoryManager.get(MessageEntity);

    for (const reciever of users) {
      for (const sender of users) {
        await messageFactory.saveMany(5, {
          recipient: reciever,
          sender: sender,
        });
      }
    }
  }
}
