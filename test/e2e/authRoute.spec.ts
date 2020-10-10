import supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { User } from '../../src/api/entities/User';
import EntitySeed from '../../src/database/seeds/EntitySeed';
import server from '../../src/server';
import UserFactory from '../../src/database/factories/UserFactory';
import Logger from '../../src/logger';
import Container from 'typedi';
jest.mock('../../src/logger');

describe('AuthRoute', () => {
  let request: any;
  let connection: Connection;
  let userSeed: EntitySeed<User>;

  beforeAll(async () => {
    const app = await server();
    request = supertest(app);
    Container.set('logger', Logger);
    connection = getConnection();
    userSeed = new EntitySeed<User>(
      connection.getMongoRepository(User),
      UserFactory
    );
  });

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    if (connection.isConnected) {
      await connection.close();
    }
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const mockUser = await UserFactory();
      const res = await request.post('/api/auth/register').send({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        password: 'mockPassword',
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user.firstName).toEqual(mockUser.firstName);
      expect(res.body.user.lastName).toEqual(mockUser.lastName);
      expect(res.body.user.email).toEqual(mockUser.email);
    });

    it('should return error if email already exists', async () => {
      const mockUser = await userSeed.seedOne();
      const res = await request.post('/api/auth/register').send({
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        email: mockUser.email,
        password: 'mockPassword',
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('The email address already exists');
    });

    it('should return an error if fields are empty', async () => {
      const res = await request.post('/api/auth/register').send({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('Invalid data');
    });
  });

  describe('login', () => {
    it('should return a user and token object with correct details', async () => {
      const mockUser = await userSeed.seedOne({ password: 'mockPassword' });
      const res = await request.post('/api/auth/login').send({
        email: mockUser.email,
        password: 'mockPassword',
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user.firstName).toEqual(mockUser.firstName);
      expect(res.body.user.lastName).toEqual(mockUser.lastName);
      expect(res.body.user.email).toEqual(mockUser.email);
    });

    it('should return an error message with incorrect password', async () => {
      const res = await request.post('/api/auth/login').send({
        email: 'mockEmail',
        password: 'mockPassword',
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('Invalid email or password');
    });

    it('should return an error message with invalid email', async () => {
      await userSeed.seedOne({ password: 'mockPassword' });
      const res = await request.post('/api/auth/login').send({
        email: 'invalidEmail',
        password: 'mockPassword',
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('Invalid email or password');
    });

    it('should return an error message with empty values', async () => {
      const res = await request.post('/api/auth/login').send({
        email: '',
        password: '',
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toEqual('Invalid data');
    });
  });
});
