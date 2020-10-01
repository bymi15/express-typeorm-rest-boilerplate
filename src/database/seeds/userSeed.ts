import userFactory from '../factories/userFactory';
import { getConnection } from 'typeorm';
import { User } from '../../api/entities/User';

export default async (data?: User): Promise<User> => {
  const user = await userFactory(data);
  await getConnection().getMongoRepository(User).save(user);
  return user;
};
