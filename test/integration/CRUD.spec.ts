import { Container } from 'typedi';
import CompanyService from '../../src/api/services/CompanyService';
import databaseLoader from '../../src/loaders/database';
import { Connection } from 'typeorm';
import Logger from '../../src/logger';
import CompanyFactory from '../../src/database/factories/CompanyFactory';
import { Company } from '../../src/api/entities/Company';
import CRUD from '../../src/api/services/CRUD';
import EntitySeed from '../../src/database/seeds/EntitySeed';
import { ErrorHandler } from '../../src/helpers/ErrorHandler';
jest.mock('../../src/logger');

describe('CRUD', () => {
  let connection: Connection;
  let entitySeed: EntitySeed<Company>;
  let crudInstance: CRUD<Company>;
  beforeAll(async () => {
    Container.reset();
    connection = await databaseLoader();
    await connection.synchronize(true);
    entitySeed = new EntitySeed<Company>(
      connection.getMongoRepository(Company),
      CompanyFactory
    );
    Container.set('logger', Logger);
    crudInstance = new CRUD(Container.get(CompanyService).getRepo(), Logger);
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
    test('Should successfully create an entity', async () => {
      const mockCompany = CompanyFactory();
      const response = await crudInstance.create(mockCompany, 'name');

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.name).toEqual(mockCompany.name);
    });

    test('Should fail to create an entity if the value for the provided identifier already exists', async () => {
      const existingCompany = await entitySeed.seedOne();
      let err: ErrorHandler, response: Company;
      try {
        response = await crudInstance.create(existingCompany, 'name');
      } catch (e) {
        err = e;
      }
      expect(response).toBeUndefined();
      expect(err).toEqual(
        new ErrorHandler(
          400,
          `The ${existingCompany.constructor.name} already exists`
        )
      );
    });
  });

  describe('find', () => {
    test('Should find all the entities', async () => {
      const mockCompanies = await entitySeed.seedMany(5);
      const response = await crudInstance.find();

      expect(response).toBeDefined();
      expect(response.length).toEqual(5);
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

    test('Should not return an error with an invalid id', async () => {
      const mockCompanyId = '22dba00215a1568fe9310409';
      let err: ErrorHandler, response: Company;
      try {
        response = await crudInstance.findOne(mockCompanyId);
      } catch (e) {
        err = e;
      }
      expect(response).toBeUndefined();
      expect(err).toEqual(new ErrorHandler(404, 'Not found'));
    });
  });

  describe('update', () => {
    test('Should update an entity with a valid id', async () => {
      const mockCompany = await entitySeed.seedOne();
      const mockUpdatedFields = {
        name: 'updatedCompanyName',
        description: 'updatedCompanyDescription',
      };

      const response = await crudInstance.update(
        mockCompany.id.toHexString(),
        mockUpdatedFields
      );

      expect(response).toBeDefined();
      expect(response.name).toEqual(mockUpdatedFields.name);
      expect(response.description).toEqual(mockUpdatedFields.description);
      expect(response.industry).toEqual(mockCompany.industry);
    });

    test('Should fail and return an error with an invalid id', async () => {
      const mockCompanyId = '22dba00215a1568fe9310409';
      const mockUpdatedFields = {
        name: 'updatedCompanyName',
        description: 'updatedCompanyDescription',
      };

      let err: ErrorHandler, response: Company;
      try {
        response = await crudInstance.update(mockCompanyId, mockUpdatedFields);
      } catch (e) {
        err = e;
      }
      expect(response).toBeUndefined();
      expect(err).toEqual(new ErrorHandler(404, 'Not found'));
    });
  });

  describe('delete', () => {
    test('Should delete an entity if id exists', async () => {
      const mockCompany = await entitySeed.seedOne();
      const response = await crudInstance.delete(mockCompany.id.toHexString());
      expect(response).toBeUndefined();
      let err: ErrorHandler, res: Company;
      try {
        res = await crudInstance.findOne(mockCompany.id.toHexString());
      } catch (e) {
        err = e;
      }
      expect(res).toBeUndefined();
      expect(err).toEqual(new ErrorHandler(404, 'Not found'));
    });
  });
});
