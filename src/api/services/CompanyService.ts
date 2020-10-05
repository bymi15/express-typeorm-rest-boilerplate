import { Inject, Service } from 'typedi';
import { Company } from '../entities/Company';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import CRUD from './CRUD';

@Service()
export default class CompanyService extends CRUD<Company> {
  constructor(
    @InjectRepository(Company)
    protected repo: MongoRepository<Company>,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(repo, logger);
  }

  getRepo(): MongoRepository<Company> {
    return this.repo;
  }

  async create(company: Company): Promise<Company> {
    return await super.create(company, 'name');
  }
}
