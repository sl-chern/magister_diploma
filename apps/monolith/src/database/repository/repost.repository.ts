import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { RepostEntity } from "../entity/repost.entity";

@Injectable()
export class RepostRepository extends Repository<RepostEntity> {
  constructor(private dataSource: DataSource) {
    super(RepostEntity, dataSource.createEntityManager());
  }
}
