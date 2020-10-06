import { JobApplication } from '../../api/entities/JobApplication';
import { MongoRepository, ObjectID } from 'typeorm';
import JobApplicationFactory from '../factories/JobApplicationFactory';
import EntitySeed from './EntitySeed';

export default class JobApplicationSeed {
  private jobApplicationSeed: EntitySeed<JobApplication>;
  private user: ObjectID;
  private company: ObjectID;

  constructor(
    repo: MongoRepository<JobApplication>,
    user: ObjectID,
    company: ObjectID
  ) {
    this.jobApplicationSeed = new EntitySeed<JobApplication>(
      repo,
      JobApplicationFactory
    );
    this.user = user;
    this.company = company;
  }

  public async seedOne(data?: JobApplication): Promise<JobApplication> {
    data = data || new JobApplication();
    data.user = this.user;
    data.company = this.company;
    return await this.jobApplicationSeed.seedOne(data);
  }

  public async seedMany(amount: number): Promise<JobApplication[]> {
    return await this.jobApplicationSeed.seedMany(amount, {
      user: this.user,
      company: this.company,
    });
  }
}
