import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource, DeepPartial } from "typeorm";
import { UserEntity } from "../../entity/user.entity";
import { RoleEntity } from "../../entity/role.entity";
import { PermissionEntity } from "../../entity/permission.entity";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import * as bcrypt from "bcryptjs";

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

    const csvContent = readFileSync("data/user.csv", "utf-8");

    const partialUserData = (await parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    })) as {
      userId: string;
      userEmail: string;
      userPassword: string;
      userName: string;
    }[];

    const adminRole = await roleRepository.findOne({
      where: { name: "admin" },
    });
    const userRole = await roleRepository.findOne({ where: { name: "user" } });

    const usersData: Partial<UserEntity>[] = [];

    for (const partialUser of partialUserData) {
      usersData.push(
        await userFactory.make(
          {
            id: partialUser.userId,
            email: partialUser.userEmail.toLowerCase(),
            name: partialUser.userName,
            password: await bcrypt.hash(partialUser.userPassword, 5),
            role:
              partialUser.userId === partialUserData[0].userId
                ? adminRole
                : userRole,
            permissions: permissions,
          },
          false,
        ),
      );
    }

    const users = await userRepository.save(usersData);

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
