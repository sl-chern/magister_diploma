import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { TagEntity } from "./tag.entity";
import { RepostEntity } from "./repost.entity";
import { LikeEntity } from "./like.entity";

@Entity({ name: "quote" })
export class QuoteEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column({ type: "varchar" })
  text: string;

  @Column({ type: "varchar" })
  history: string;

  @ManyToOne(() => UserEntity, (author) => author.quotes)
  author: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.quotes)
  @JoinTable()
  tags: TagEntity[];

  @OneToMany(() => RepostEntity, (repost) => repost.post)
  reposts: RepostEntity[];

  @OneToOne(() => RepostEntity, (repost) => repost.repostedBy)
  repostedPost?: RepostEntity;

  @OneToMany(() => LikeEntity, (like) => like.quote, { cascade: true })
  likes: LikeEntity[];
}
