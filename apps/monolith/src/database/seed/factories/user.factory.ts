import { setSeederFactory } from "typeorm-extension";
import { UserEntity } from "../../entity/user.entity";
import { Sex } from "@repo/utilities";
import { UniqueEnforcer } from "enforce-unique";

const uniqueEnforcerEmail = new UniqueEnforcer();

export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();

  const sexFlag = faker.number.int(1);
  const sex: Sex = sexFlag ? "male" : "female";

  user.name = faker.person.fullName({ sex });

  user.email = uniqueEnforcerEmail.enforce(() => {
    return faker.internet.email();
  });

  user.is_confirmed = true;
  user.password = faker.internet.password({ length: 15 });

  return user;
});
