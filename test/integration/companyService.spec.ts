import { Container } from 'typedi';
import CompanyService from '../../src/api/services/CompanyService';
import databaseLoader from '../../src/loaders/database';
import { Connection } from 'typeorm';
import Logger from '../../src/logger';
import CompanyFactory from '../../src/database/factories/CompanyFactory';
import { Company } from '../../src/api/entities/Company';
import EntitySeed from '../../src/database/seeds/EntitySeed';
import { ErrorHandler } from '../../src/helpers/ErrorHandler';
jest.mock('../../src/logger');

describe('CompanyService', () => {
  let connection: Connection;
  let companySeed: EntitySeed<Company>;
  let companyServiceInstance: CompanyService;
  beforeAll(async () => {
    Container.reset();
    connection = await databaseLoader();
    await connection.synchronize(true);
    companySeed = new EntitySeed<Company>(
      connection.getMongoRepository(Company),
      CompanyFactory
    );
    Container.set('logger', Logger);
    companyServiceInstance = Container.get(CompanyService);
  });

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    if (connection.isConnected) {
      await connection.close();
    }
  });

  describe('create', () => {
    test('Should successfully create a company record', async () => {
      const mockCompany = CompanyFactory();
      const response = await companyServiceInstance.create(mockCompany);

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.name).toEqual(mockCompany.name);
    });

    test('Should fail to create a company record if the company name already exists', async () => {
      const existingCompany = await companySeed.seedOne();
      let err: ErrorHandler, response: Company;
      try {
        response = await companyServiceInstance.create(existingCompany);
      } catch (e) {
        err = e;
      }
      expect(response).toBeUndefined();
      expect(err).toEqual(new ErrorHandler(400, 'The Company already exists'));
    });
  });
});
