import { DataSource, In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PermissionEntity } from "../entity/permission.entity";

@Injectable()
export class PermissionRepository extends Repository<PermissionEntity> {
  constructor(private dataSource: DataSource) {
    super(PermissionEntity, dataSource.createEntityManager());
  }

  findByNames(permissions: Array<string>): Promise<Array<PermissionEntity>> {
    return this.find({
      where: {
        name: In(permissions),
      },
    });
  }
}
