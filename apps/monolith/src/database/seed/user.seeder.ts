import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { RoleEntity } from "../entity/role.entity";
import { PermissionEntity } from "../entity/permission.entity";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "role" RESTART IDENTITY CASCADE;');

    const repository = dataSource.getRepository(RoleEntity);
    await repository.insert({ name: "user" });
    await repository.insert({ name: "admin" });

    const userFactory = factoryManager.get(UserEntity);

    const roleRepository = dataSource.getRepository(RoleEntity);
    const permissionRepository = dataSource.getRepository(PermissionEntity);

    const permissions = await permissionRepository.find();

    await userFactory.save({
      role: await roleRepository.findOneOrFail({
        where: {
          name: "admin",
        },
      }),
      permissions: permissions,
    });

    await userFactory.saveMany(100, {
      role: await roleRepository.findOneOrFail({
        where: {
          name: "user",
        },
      }),
      permissions: permissions,
    });
  }
}
