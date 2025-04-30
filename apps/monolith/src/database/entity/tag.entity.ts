import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuoteEntity } from "./quote.entity";

@Entity({ name: "tag" })
export class TagEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @ManyToMany(() => QuoteEntity, (quote) => quote.tags)
  quotes: QuoteEntity[];
}
