import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { PermissionEntity } from "../entity/permission.entity";
import { permissionType } from "../../helpers/constants";

export default class PermissionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('TRUNCATE "permission" RESTART IDENTITY CASCADE;');

    const permissionRepository = dataSource.getRepository(PermissionEntity);

    for (const permissionName in permissionType) {
      await permissionRepository.insert({
        name: permissionType[permissionName] as string,
      });
    }
  }
}
