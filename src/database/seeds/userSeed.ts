import { User } from '../../api/entities/User';
import { Connection } from 'typeorm';
import UserFactory from '../factories/UserFactory';

export default class UserSeed {
  private connection: Connection;
  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async seedOne(data?: User): Promise<User> {
    const user = await UserFactory(data);
    await this.connection.getMongoRepository(User).save(user);
    return user;
  }

  public async seedMany(amount: number): Promise<User[]> {
    const res = [];
    for (let i = 0; i < amount; i++) {
      res[i] = await UserFactory();
      await this.connection.getMongoRepository(User).save(res[i]);
    }
    return res;
  }
}
