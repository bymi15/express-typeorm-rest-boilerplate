import { Container } from 'typedi';
import CompanyService from '../../src/api/services/company';
import databaseLoader from '../../src/loaders/database';
import CompanySeed from '../../src/database/seeds/CompanySeed';
import { Connection } from 'typeorm';
import Logger from '../../src/logger';
import CompanyFactory from '../../src/database/factories/CompanyFactory';
import { Company } from '../../src/api/entities/Company';
jest.mock('../../src/logger');

describe('CompanyService', () => {
  let connection: Connection;
  let companySeed: CompanySeed;
  beforeAll(async (done) => {
    Container.reset();
    connection = await databaseLoader();
    await connection.synchronize(true);
    companySeed = new CompanySeed(connection);
    Container.set('logger', Logger);
    done();
  });

  beforeEach(async (done) => {
    await connection.dropDatabase();
    done();
  });

  afterAll(async (done) => {
    if (connection.isConnected) {
      await connection.close();
    }
    done();
  });

  describe('create', () => {
    test('Should successfully create a company record', async () => {
      const mockCompany = CompanyFactory();
      const companyServiceInstance = Container.get(CompanyService);
      const response = await companyServiceInstance.create(mockCompany);

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.name).toEqual(mockCompany.name);
    });

    test('Should fail to create a company record if the company name already exists', async () => {
      const existingCompany = await companySeed.seedOne();
      const companyServiceInstance = Container.get(CompanyService);
      let err: Error, response: Company;
      try {
        response = await companyServiceInstance.create(existingCompany);
      } catch (e) {
        err = e;
      }
      expect(response).toBeUndefined();
      expect(err).toEqual(new Error('The company already exists'));
    });
  });

  describe('find', () => {
    test('Should find all the companies', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const companyServiceInstance = Container.get(CompanyService);
      const response = await companyServiceInstance.find();

      expect(response).toBeDefined();
      expect(response.sort()).toEqual(mockCompanies.sort());
    });
  });

  describe('findOne', () => {
    test('Should find a company with the valid id', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const companyServiceInstance = Container.get(CompanyService);
      const response = await companyServiceInstance.findOne(
        mockCompanies[0].id.toHexString()
      );

      expect(response).toBeDefined();
      expect(response).toEqual(mockCompanies[0]);
    });

    test('Should return an error with an invalid id', async () => {
      const mockCompanyId = '22dba00215a1568fe9310409';
      const companyServiceInstance = Container.get(CompanyService);
      const response = await companyServiceInstance.findOne(mockCompanyId);

      expect(response).toBeUndefined();
    });
  });
});
