import { Container } from 'typedi';
import JobApplicationService from '../../src/api/services/JobApplicationService';
import databaseLoader from '../../src/loaders/database';
import { Connection } from 'typeorm';
import Logger from '../../src/logger';
import JobApplicationFactory from '../../src/database/factories/JobApplicationFactory';
import CompanyFactory from '../../src/database/factories/CompanyFactory';
import { JobApplication } from '../../src/api/entities/JobApplication';
import JobApplicationSeed from '../../src/database/seeds/JobApplicationSeed';
import UserFactory from '../../src/database/factories/UserFactory';
import { User } from '../../src/api/entities/User';
import EntitySeed from '../../src/database/seeds/EntitySeed';
import { Company } from '../../src/api/entities/Company';
jest.mock('../../src/logger');

describe('JobApplicationService', () => {
  let connection: Connection;
  let jobApplicationSeed: JobApplicationSeed;
  let jobApplicationServiceInstance: JobApplicationService;
  let mockUser: User;
  let mockCompany: Company;
  beforeAll(async () => {
    Container.reset();
    connection = await databaseLoader();
    await connection.synchronize(true);
    Container.set('logger', Logger);
    jobApplicationServiceInstance = Container.get(JobApplicationService);
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    mockUser = await new EntitySeed<User>(
      connection.getMongoRepository(User),
      UserFactory
    ).seedOne();
    Reflect.deleteProperty(mockUser, 'password');
    mockCompany = await new EntitySeed<Company>(
      connection.getMongoRepository(Company),
      CompanyFactory
    ).seedOne();
    jobApplicationSeed = new JobApplicationSeed(
      connection.getMongoRepository(JobApplication),
      mockUser.id,
      mockCompany.id
    );
  });

  afterAll(async () => {
    if (connection.isConnected) {
      await connection.close();
    }
  });

  describe('create', () => {
    test('Should successfully create and return a jobApplication with user and company filled', async () => {
      const mockJobApplication = JobApplicationFactory({
        user: mockUser.id,
        company: mockCompany.id,
      });
      const response = await jobApplicationServiceInstance.create(
        mockJobApplication
      );

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.company).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.company).toEqual(mockCompany);
      expect(response.user).toEqual(mockUser);
    });
  });

  describe('findByUser', () => {
    test('Should successfully find all jobApplications by user id', async () => {
      await jobApplicationSeed.seedMany(5);
      const response = await jobApplicationServiceInstance.findByUser(
        mockUser.id
      );

      expect(response).toBeDefined();
      expect(response.length).toEqual(5);
    });
    test('Should return jobApplications with company filled and user field removed', async () => {
      await jobApplicationSeed.seedOne();
      const response = await jobApplicationServiceInstance.findByUser(
        mockUser.id
      );

      expect(response).toBeDefined();
      expect(response[0].company).toBeDefined();
      expect(response[0].company).toEqual(mockCompany);
      expect(response[0].user).toBeUndefined();
    });
  });

  describe('find', () => {
    test('Should successfully find all jobApplications', async () => {
      await jobApplicationSeed.seedMany(5);
      const response = await jobApplicationServiceInstance.find();

      expect(response).toBeDefined();
      expect(response.length).toEqual(5);
    });
    test('Should return jobApplications with company and user filled', async () => {
      await jobApplicationSeed.seedOne();
      const response = await jobApplicationServiceInstance.find();

      expect(response).toBeDefined();
      expect(response[0].company).toBeDefined();
      expect(response[0].company).toEqual(mockCompany);
      expect(response[0].user).toBeDefined();
      expect(response[0].user).toEqual(mockUser);
    });
  });
});
