import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { Inject, Service } from 'typedi';
import { User } from '../entities/User';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { IUserInputDTO, IUserTokenObject } from '../../types/auth';
import { validate } from 'class-validator';

@Service()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: MongoRepository<User>,
    @Inject('logger')
    private logger: Logger
  ) {}

  getRepo(): MongoRepository<User> {
    return this.userRepo;
  }

  async register(userInputDTO: IUserInputDTO): Promise<IUserTokenObject> {
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
    if (foundUser) throw new Error('The email address already exists');

    const userRecord: User = await this.userRepo.save(newUser);
    if (!userRecord) throw new Error('User cannot be created');

    const token = this.generateToken(userRecord);
    const user = userRecord;
    Reflect.deleteProperty(user, 'password');
    return { user, token };
  }

  async login(email: string, password: string): Promise<IUserTokenObject> {
    this.logger.debug('Authenticating user...');
    const userRecord = await this.userRepo.findOne({ email });
    if (!userRecord) throw new Error('Invalid email or password');

    const validPassword = await bcrypt.compare(password, userRecord.password);

    if (validPassword) {
      const token = this.generateToken(userRecord);
      const user = userRecord;
      Reflect.deleteProperty(user, 'password');
      return { user, token };
    }
    throw new Error('Invalid email or password');
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
}
