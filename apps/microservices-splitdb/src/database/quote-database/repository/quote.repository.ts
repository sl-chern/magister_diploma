import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { QuoteEntity } from "../entity/quote.entity";

@Injectable()
export class QuoteRepository extends Repository<QuoteEntity> {
  constructor(private dataSource: DataSource) {
    super(QuoteEntity, dataSource.createEntityManager());
  }
}
