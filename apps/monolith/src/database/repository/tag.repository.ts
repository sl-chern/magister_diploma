import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TagEntity } from "../entity/tag.entity";

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  constructor(private dataSource: DataSource) {
    super(TagEntity, dataSource.createEntityManager());
  }
}
