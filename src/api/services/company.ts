import { Inject, Service } from 'typedi';
import { Company } from '../entities/Company';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { validate } from 'class-validator';

@Service()
export default class CompanyService {
  constructor(
    @InjectRepository(Company)
    private repo: MongoRepository<Company>,
    @Inject('logger')
    private logger: Logger
  ) {}

  getRepo(): MongoRepository<Company> {
    return this.repo;
  }

  async create(company: Company): Promise<Company> {
    const errors = await validate(company, {
      validationError: { target: false },
    });
    if (errors.length > 0) throw errors;

    const foundCompany = await this.repo.findOne({ name: company.name });
    if (foundCompany) throw new Error('The company already exists');

    return await this.repo.save(company);
  }

  async find(): Promise<Company[]> {
    return await this.repo.find();
  }

  async findOne(companyId: string): Promise<Company | undefined> {
    return await this.repo.findOne(companyId);
  }
}
