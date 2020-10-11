import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import EntitySeed from '../../src/database/seeds/EntitySeed';
import server from '../../src/server';
import CompanyFactory from '../../src/database/factories/CompanyFactory';
import UserFactory from '../../src/database/factories/UserFactory';
import Logger from '../../src/logger';
import Container from 'typedi';
import { Company } from '../../src/api/entities/Company';
import { User } from '../../src/api/entities/User';
jest.mock('../../src/logger');

describe('CompaniesRoute', () => {
  let request: any;
  let connection: Connection;
  let companySeed: EntitySeed<Company>;
  const baseUrl = '/api/company';

  let adminUserToken: string, staffUserToken: string, normalUserToken: string;
  beforeAll(async () => {
    const app = await server();
    request = supertest(app);
    Container.set('logger', Logger);
    connection = getConnection();
    await connection.dropDatabase();
    companySeed = new EntitySeed<Company>(
      connection.getMongoRepository(Company),
      CompanyFactory
    );
    const userSeed = new EntitySeed<User>(
      connection.getMongoRepository(User),
      UserFactory
    );
    const adminUser = await userSeed.seedOne({
      role: 'admin',
      password: 'adminPassword',
    });
    const staffUser = await userSeed.seedOne({
      role: 'staff',
      password: 'staffPassword',
    });
    const normalUser = await userSeed.seedOne({
      role: 'user',
      password: 'userPassword',
    });

    let res = await request.post('/api/auth/login').send({
      email: adminUser.email,
      password: 'adminPassword',
    });
    adminUserToken = `Bearer ${res.body.token}`;

    res = await request.post('/api/auth/login').send({
      email: staffUser.email,
      password: 'staffPassword',
    });
    staffUserToken = `Bearer ${res.body.token}`;

    res = await request.post('/api/auth/login').send({
      email: normalUser.email,
      password: 'userPassword',
    });
    normalUserToken = `Bearer ${res.body.token}`;
  });

  beforeEach(async () => {
    try {
      await connection.getMongoRepository(Company).clear();
    } catch (err) {}
  });

  afterAll(async () => {
    if (connection.isConnected) {
      await connection.close();
    }
  });

  describe('GET /company', () => {
    it('should return a list of companies for admin user', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const res = await request
        .get(baseUrl)
        .set({ Authorization: adminUserToken });
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(5);
      expect(res.body.sort()[0].name).toEqual(mockCompanies.sort()[0].name);
    });
    it('should return a list of companies for staff user', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const res = await request
        .get(baseUrl)
        .set({ Authorization: staffUserToken });
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(5);
      expect(res.body.sort()[0].name).toEqual(mockCompanies.sort()[0].name);
    });
    it('should return a list of companies for normal user', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const res = await request
        .get(baseUrl)
        .set({ Authorization: normalUserToken });
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(5);
      expect(res.body.sort()[0].name).toEqual(mockCompanies.sort()[0].name);
    });
    it('should return an unauthorized error without an auth token', async () => {
      await companySeed.seedOne();
      const res = await request.get(baseUrl);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /company/:id', () => {
    it('should return a company by id for admin user', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const res = await request
        .get(`${baseUrl}/${mockCompanies[0].id}`)
        .set({ Authorization: adminUserToken });
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(mockCompanies[0].id.toHexString());
      expect(res.body.name).toEqual(mockCompanies[0].name);
    });
    it('should return a company by id for staff user', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const res = await request
        .get(`${baseUrl}/${mockCompanies[0].id}`)
        .set({ Authorization: staffUserToken });
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(mockCompanies[0].id.toHexString());
      expect(res.body.name).toEqual(mockCompanies[0].name);
    });
    it('should return a company by id for normal user', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const res = await request
        .get(`${baseUrl}/${mockCompanies[0].id}`)
        .set({ Authorization: normalUserToken });
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(mockCompanies[0].id.toHexString());
      expect(res.body.name).toEqual(mockCompanies[0].name);
    });
    it('should return an internal server error with invalid company id', async () => {
      const mockCompany = await companySeed.seedOne();
      const invalidCompanyId = mockCompany.id.toHexString().split('').reverse();
      const res = await request
        .get(`${baseUrl}/${invalidCompanyId}`)
        .set({ Authorization: staffUserToken });
      expect(res.statusCode).toEqual(500);
    });
    it('should return an unauthorized error without an auth token', async () => {
      const mockCompany = await companySeed.seedOne();
      const res = await request.get(`${baseUrl}/${mockCompany.id}`);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /company/:id', () => {
    it('should successfully delete a company by id for admin user', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const mockCompanyId = mockCompanies[0].id;
      let res = await request
        .delete(`${baseUrl}/${mockCompanyId}`)
        .set({ Authorization: adminUserToken });
      expect(res.statusCode).toEqual(204);
      res = await request.get(baseUrl).set({ Authorization: adminUserToken });
      expect(res.body.length).toEqual(4);
      res = await request
        .get(`${baseUrl}/${mockCompanyId}`)
        .set({ Authorization: adminUserToken });
      expect(res.statusCode).toEqual(404);
    });
    it('should successfully delete a company by id for staff user', async () => {
      const mockCompanies = await companySeed.seedMany(5);
      const mockCompanyId = mockCompanies[0].id;
      let res = await request
        .delete(`${baseUrl}/${mockCompanyId}`)
        .set({ Authorization: staffUserToken });
      expect(res.statusCode).toEqual(204);
      res = await request.get(baseUrl).set({ Authorization: staffUserToken });
      expect(res.body.length).toEqual(4);
      res = await request
        .get(`${baseUrl}/${mockCompanyId}`)
        .set({ Authorization: staffUserToken });
      expect(res.statusCode).toEqual(404);
    });
    it('should return a forbidden error for normal user', async () => {
      const mockCompany = await companySeed.seedOne();
      const res = await request
        .delete(`${baseUrl}/${mockCompany.id}`)
        .set({ Authorization: normalUserToken });
      expect(res.statusCode).toEqual(403);
    });
    it('should return an unauthorized error without an auth token', async () => {
      const mockCompany = await companySeed.seedOne();
      const res = await request.delete(`${baseUrl}/${mockCompany.id}`);
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
    it('should return an internal server error with invalid company id', async () => {
      const mockCompany = await companySeed.seedOne();
      const invalidCompanyId = mockCompany.id.toHexString().split('').reverse();
      const res = await request
        .delete(`${baseUrl}/${invalidCompanyId}`)
        .set({ Authorization: staffUserToken });
      expect(res.statusCode).toEqual(500);
    });
  });
});
