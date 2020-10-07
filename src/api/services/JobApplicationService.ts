import Container, { Inject, Service } from 'typedi';
import { JobApplication } from '../entities/JobApplication';
import { MongoRepository, ObjectID } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import CRUD from './CRUD';
import UserService from './UserService';
import CompanyService from './CompanyService';

@Service()
export default class JobApplicationService extends CRUD<JobApplication> {
  constructor(
    @InjectRepository(JobApplication)
    protected repo: MongoRepository<JobApplication>,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(repo, logger);
  }

  private async fillUser(jobApplication: JobApplication): Promise<void> {
    await super.fillObjectIdField(
      jobApplication,
      'user',
      Container.get(UserService)
    );
  }

  private async fillCompany(jobApplication: JobApplication): Promise<void> {
    await super.fillObjectIdField(
      jobApplication,
      'company',
      Container.get(CompanyService)
    );
  }

  async create(jobApplication: JobApplication): Promise<JobApplication> {
    const job = await super.create(jobApplication);
    await this.fillUser(job);
    await this.fillCompany(job);
    return job;
  }

  async findByUser(user: ObjectID): Promise<JobApplication[]> {
    const jobs: JobApplication[] = await this.repo.find({ user });
    for (const job of jobs) {
      await this.fillCompany(job);
      Reflect.deleteProperty(job, 'user');
    }
    return jobs;
  }

  async find(): Promise<JobApplication[]> {
    const jobs: JobApplication[] = await super.find();
    for (const job of jobs) {
      await this.fillUser(job);
      await this.fillCompany(job);
    }
    return jobs;
  }

  async findOne(id: string): Promise<JobApplication | undefined> {
    const job = await super.findOne(id);
    if (job) {
      await this.fillUser(job);
      await this.fillCompany(job);
    }
    return job;
  }

  async update(
    id: string,
    jobApplication: JobApplication
  ): Promise<JobApplication> {
    const job = await super.update(id, jobApplication);
    if (job) {
      await this.fillUser(job);
      await this.fillCompany(job);
    }
    return job;
  }
}
