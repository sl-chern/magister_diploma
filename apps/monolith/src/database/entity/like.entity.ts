import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { QuoteEntity } from "./quote.entity";

@Entity({ name: "like" })
export class LikeEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.likes)
  user: UserEntity;

  @ManyToOne(() => QuoteEntity, (quote) => quote.likes, { onDelete: "CASCADE" })
  quote: QuoteEntity;
}
