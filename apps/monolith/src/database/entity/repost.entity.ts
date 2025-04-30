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

  @ManyToOne(() => QuoteEntity, (quote) => quote.reposts)
  post: QuoteEntity;

  @OneToOne(() => QuoteEntity, (quote) => quote.repostedPost)
  @JoinColumn()
  repostedBy: QuoteEntity[];
}
