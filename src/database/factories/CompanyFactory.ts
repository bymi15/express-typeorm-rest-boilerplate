import * as faker from 'faker';
import { Company } from '../../api/entities/Company';

export default (data?: Company): Company => {
  return new Company({
    name: (data && data.name) || faker.company.companyName(),
    description: (data && data.description) || faker.company.catchPhrase(),
    logo: (data && data.logo) || faker.image.business(),
    website: (data && data.website) || faker.internet.url(),
    headquarters: (data && data.headquarters) || {
      city: faker.address.city(),
      country: faker.address.country(),
    },
    industry: (data && data.industry) || faker.company.bsNoun(),
    foundedYear:
      (data && data.foundedYear) || faker.date.past().getFullYear().toString(),
  });
};
