import { setSeederFactory } from "typeorm-extension";
import { QuoteEntity } from "../../entity/quote.entity";

export default setSeederFactory(QuoteEntity, (faker, partialQuote) => {
  const quote = new QuoteEntity();

  console.log(partialQuote);

  quote.history = faker.lorem.paragraph(1);
  quote.text = faker.lorem.sentence(1);

  return quote;
});
