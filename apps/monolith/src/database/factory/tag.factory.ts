import { setSeederFactory } from "typeorm-extension";
import { TagEntity } from "../entity/tag.entity";

export default setSeederFactory(TagEntity, (faker) => {
  const tag = new TagEntity();

  tag.name = faker.word.noun();

  return tag;
});
