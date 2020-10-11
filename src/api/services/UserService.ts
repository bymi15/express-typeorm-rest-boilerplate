import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { Inject, Service } from 'typedi';
import { User } from '../entities/User';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { IUserInputDTO, IUserResponseDTO } from '../../types';
import { validate } from 'class-validator';
import CRUD from './CRUD';
import { ErrorHandler } from '../../helpers/ErrorHandler';

@Service()
export default class UserService extends CRUD<User> {
  constructor(
    @InjectRepository(User)
    protected userRepo: MongoRepository<User>,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(userRepo, logger);
  }

  getRepo(): MongoRepository<User> {
    return this.userRepo;
  }

  async register(userInputDTO: IUserInputDTO): Promise<IUserResponseDTO> {
    this.logger.debug('Registering user...');
    const hashedPassword = await bcrypt.hash(userInputDTO.password, 12);
    const newUser = new User({
      firstName: userInputDTO.firstName,
      lastName: userInputDTO.lastName,
      email: userInputDTO.email,
      password: hashedPassword,
    });
    const errors = await validate(newUser, {
      validationError: { target: false },
    });
    if (errors.length > 0) throw errors;

    const foundUser = await this.userRepo.findOne({ email: newUser.email });
    if (foundUser)
      throw new ErrorHandler(400, 'The email address already exists');

    const userRecord: User = await this.userRepo.save(newUser);
    if (!userRecord) throw new ErrorHandler(500, 'User cannot be created');

    const token = this.generateToken(userRecord);
    const user = userRecord;
    Reflect.deleteProperty(user, 'password');
    return { user, token };
  }

  async login(email: string, password: string): Promise<IUserResponseDTO> {
    this.logger.debug('Authenticating user...');
    const userRecord = await this.userRepo.findOne({ email });
    if (!userRecord) throw new ErrorHandler(401, 'Invalid email or password');

    const validPassword = await bcrypt.compare(password, userRecord.password);

    if (validPassword) {
      const token = this.generateToken(userRecord);
      const user = userRecord;
      Reflect.deleteProperty(user, 'password');
      return { user, token };
    }
    throw new ErrorHandler(401, 'Invalid email or password');
  }

  generateToken(userRecord: User): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 7);
    this.logger.debug(`Signing JWT for userId: ${userRecord.id}`);
    return jwt.sign(
      {
        id: userRecord.id,
        email: userRecord.email,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }

  async find(): Promise<User[]> {
    const users = await this.repo.find();
    for (const user of users) {
      Reflect.deleteProperty(user, 'password');
    }
    return users;
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = await this.repo.findOne(id);
    if (user) {
      Reflect.deleteProperty(user, 'password');
    }
    return user;
  }
}
