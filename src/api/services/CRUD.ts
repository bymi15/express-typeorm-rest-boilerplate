import { Service } from 'typedi';
import { MongoRepository } from 'typeorm';
import { Logger } from 'winston';
import { validate } from 'class-validator';

@Service()
export default class CRUD<Entity> {
  protected repo: MongoRepository<Entity>;
  protected logger: Logger;

  constructor(repo: MongoRepository<Entity>, logger: Logger) {
    this.repo = repo;
    this.logger = logger;
  }

  getRepo(): MongoRepository<Entity> {
    return this.repo;
  }

  async create(entity: Entity, identifier: string): Promise<Entity> {
    const errors = await validate(entity, {
      validationError: { target: false },
    });
    const foundCompany = await this.repo.findOne({
      [identifier]: entity[identifier],
    });
    if (foundCompany)
      throw new Error(`The ${entity.constructor.name} already exists`);

    if (errors.length > 0) throw errors;
    return await this.repo.save(entity);
  }

  async find(): Promise<Entity[]> {
    return await this.repo.find();
  }

  async findOne(id: string): Promise<Entity | undefined> {
    return await this.repo.findOne(id);
  }

  async update(id: string, newEntity: Entity): Promise<Entity> {
    const entity = await this.findOne(id);
    if (!entity) throw new Error('The id is invalid');
    Object.keys(newEntity).forEach((key) => {
      if (newEntity[key]) {
        entity[key] = newEntity[key];
      }
    });
    const errors = await validate(entity, {
      validationError: { target: false },
    });
    if (errors.length > 0) throw errors;
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
