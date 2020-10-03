import { Container } from 'typedi';
import CompanyService from '../../src/api/services/company';
import databaseLoader from '../../src/loaders/database';
import { Connection } from 'typeorm';
import Logger from '../../src/logger';
import CompanyFactory from '../../src/database/factories/CompanyFactory';
import { Company } from '../../src/api/entities/Company';
import CRUD from '../../src/api/services/CRUD';
import EntitySeed from '../../src/database/seeds/EntitySeed';
jest.mock('../../src/logger');

describe('CRUD', () => {
  let connection: Connection;
  let entitySeed: EntitySeed<Company>;
  let crudInstance: CRUD<Company>;
  beforeAll(async (done) => {
    Container.reset();
    connection = await databaseLoader();
    await connection.synchronize(true);
    entitySeed = new EntitySeed<Company>(
      connection.getMongoRepository(Company),
      CompanyFactory
    );
    Container.set('logger', Logger);
    crudInstance = new CRUD(Container.get(CompanyService).getRepo(), Logger);
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
    test('Should successfully create an entity', async () => {
      const mockCompany = CompanyFactory();
      const response = await crudInstance.create(mockCompany, 'name');

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.name).toEqual(mockCompany.name);
    });

    test('Should fail to create an entity if the value for the provided identifier already exists', async () => {
      const existingCompany = await entitySeed.seedOne();
      let err: Error, response: Company;
      try {
        response = await crudInstance.create(existingCompany, 'name');
      } catch (e) {
        err = e;
      }
      expect(response).toBeUndefined();
      expect(err).toEqual(
        new Error(`The ${existingCompany.constructor.name} already exists`)
      );
    });
  });

  describe('find', () => {
    test('Should find all the entities', async () => {
      const mockCompanies = await entitySeed.seedMany(5);
      const response = await crudInstance.find();

      expect(response).toBeDefined();
      expect(response.sort()).toEqual(mockCompanies.sort());
    });
  });

  describe('findOne', () => {
    test('Should find an entity with a valid id', async () => {
      const mockCompanies = await entitySeed.seedMany(5);
      const response = await crudInstance.findOne(
        mockCompanies[0].id.toHexString()
      );

      expect(response).toBeDefined();
      expect(response).toEqual(mockCompanies[0]);
    });

    test('Should not return a value with an invalid id', async () => {
      const mockCompanyId = '22dba00215a1568fe9310409';
      const response = await crudInstance.findOne(mockCompanyId);

      expect(response).toBeUndefined();
    });
  });

  describe('update', () => {
    test('Should update an entity with a valid id', async () => {
      const mockCompany = await entitySeed.seedOne();
      const updateCompany = new Company({
        name: 'updatedCompanyName',
        description: 'updatedCompanyDescription',
      });

      const response = await crudInstance.update(
        mockCompany.id.toHexString(),
        updateCompany
      );

      expect(response).toBeDefined();
      expect(response.name).toEqual(updateCompany.name);
      expect(response.description).toEqual(updateCompany.description);
      expect(response.industry).toEqual(mockCompany.industry);
    });

    test('Should fail and return an error with an invalid id', async () => {
      const mockCompanyId = '22dba00215a1568fe9310409';
      const mockCompany = CompanyFactory();

      let err: Error, response: Company;
      try {
        response = await crudInstance.update(mockCompanyId, mockCompany);
      } catch (e) {
        err = e;
      }
      expect(response).toBeUndefined();
      expect(err).toEqual(new Error(`The id is invalid`));
    });
  });

  describe('delete', () => {
    test('Should delete an entity if id exists', async () => {
      const mockCompany = await entitySeed.seedOne();
      const response = await crudInstance.delete(mockCompany.id.toHexString());
      const foundCompany = await crudInstance.findOne(
        mockCompany.id.toHexString()
      );
      expect(response).toBeUndefined();
      expect(foundCompany).toBeUndefined();
    });
  });
});
