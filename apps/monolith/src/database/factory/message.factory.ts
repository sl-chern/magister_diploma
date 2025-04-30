import { setSeederFactory } from "typeorm-extension";
import { MessageEntity } from "../entity/message.entity";

export default setSeederFactory(MessageEntity, (faker) => {
  const message = new MessageEntity();

  message.text = faker.lorem.paragraph(1);

  return message;
});
