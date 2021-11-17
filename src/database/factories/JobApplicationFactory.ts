import * as faker from 'faker';
import { ObjectId } from 'mongodb';
import { ObjectID } from 'typeorm';
import { JobApplication } from '../../api/entities/JobApplication';

export default (data?: JobApplication): JobApplication => {
  return new JobApplication({
    role: (data && data.role) || faker.name.jobTitle(),
    description: (data && data.description) || faker.lorem.sentences(),
    company: (data && data.company) || (new ObjectId() as ObjectID),
    user: (data && data.user) || (new ObjectId() as ObjectID),
    status:
      (data && data.status) ||
      faker.random.arrayElement(['applied', 'offer', 'accepted', 'rejected']),
    appliedDate: (data && data.appliedDate) || faker.date.past().toUTCString(),
  });
};
