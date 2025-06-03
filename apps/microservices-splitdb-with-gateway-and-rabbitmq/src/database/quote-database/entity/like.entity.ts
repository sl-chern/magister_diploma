import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuoteEntity } from "./quote.entity";

@Entity({ name: "like" })
export class LikeEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("uuid")
  user: string;

  @ManyToOne(() => QuoteEntity, (quote) => quote.likes, {
    onDelete: "CASCADE",
  })
  quote: QuoteEntity;
}
