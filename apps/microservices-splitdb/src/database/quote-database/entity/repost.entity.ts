import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { QuoteEntity } from "./quote.entity";

@Entity({ name: "repost" })
export class RepostEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @ManyToOne(() => QuoteEntity, (quote) => quote.reposts, {
    onDelete: "CASCADE",
  })
  post: QuoteEntity;

  @OneToOne(() => QuoteEntity, (quote) => quote.repostedPost, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  repostedBy: QuoteEntity[];
}
