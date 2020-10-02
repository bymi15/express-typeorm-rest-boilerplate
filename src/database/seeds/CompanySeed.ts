import { Company } from '../../api/entities/Company';
import { Connection } from 'typeorm';
import CompanyFactory from '../factories/CompanyFactory';

export default class UserSeed {
  private connection: Connection;
  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async seedOne(data?: Company): Promise<Company> {
    const company = CompanyFactory(data);
    await this.connection.getMongoRepository(Company).save(company);
    return company;
  }

  public async seedMany(amount: number): Promise<Company[]> {
    const res = [];
    for (let i = 0; i < amount; i++) {
      res[i] = CompanyFactory();
      await this.connection.getMongoRepository(Company).save(res[i]);
    }
    return res;
  }
}
