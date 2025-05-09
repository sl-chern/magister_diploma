import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource, DeepPartial } from "typeorm";
import { UserEntity } from "../../entity/user.entity";
import { RoleEntity } from "../../entity/role.entity";
import { PermissionEntity } from "../../entity/permission.entity";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query(
      'TRUNCATE "user_subscribers_user" RESTART IDENTITY CASCADE;',
    );
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "role" RESTART IDENTITY CASCADE;');

    const userFactory = factoryManager.get(UserEntity);

    const roleRepository = dataSource.getRepository(RoleEntity);
    const permissionRepository = dataSource.getRepository(PermissionEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    await roleRepository.insert({ name: "user" });
    await roleRepository.insert({ name: "admin" });

    const permissions = await permissionRepository.find();

    await userFactory.save({
      role: await roleRepository.findOneOrFail({
        where: {
          name: "admin",
        },
      }),
      permissions: permissions,
    });

    const users = await userFactory.saveMany(100, {
      role: await roleRepository.findOneOrFail({
        where: {
          name: "user",
        },
      }),
      permissions: permissions,
    });

    for (const user of users) {
      const shuffled = users.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 15);
      const updatedUser = await userRepository.preload({
        ...user,
        subscribers: selected,
      });
      await userRepository.save(updatedUser as DeepPartial<UserEntity>);
    }
  }
}
