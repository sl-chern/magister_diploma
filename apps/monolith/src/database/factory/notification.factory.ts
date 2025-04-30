import { setSeederFactory } from "typeorm-extension";
import { NotificationEntity } from "../entity/notification.entity";

export default setSeederFactory(NotificationEntity, (faker) => {
  const notification = new NotificationEntity();

  notification.text = faker.lorem.paragraph(1);

  return notification;
});
