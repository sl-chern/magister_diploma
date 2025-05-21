import { setSeederFactory } from "typeorm-extension";
import { QuoteEntity } from "../../entity/quote.entity";

export default setSeederFactory(QuoteEntity, (faker) => {
  const quote = new QuoteEntity();

  quote.history = faker.lorem.paragraph(1);
  quote.text = faker.lorem.sentence(1);

  return quote;
});
