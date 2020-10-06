import { Service } from 'typedi';
import { MongoRepository, ObjectID } from 'typeorm';
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

  protected async fillObjectIdField(
    entity: Entity,
    fieldName: string,
    fieldEntityService: CRUD<any>
  ): Promise<void> {
    const entityName = entity.constructor.name;
    if (!entity) throw new Error(`${entityName} not found`);
    if (!(fieldName in entity))
      throw new Error(`${fieldName} does not exist in ${entityName}`);
    entity[fieldName] = await fieldEntityService.findOne(
      <ObjectID>entity[fieldName]
    );
    if (!entity[fieldName]) {
      throw new Error(`Invalid ${fieldName}`);
    }
  }

  async create(entity: Entity, identifier?: string): Promise<Entity> {
    const errors = await validate(entity, {
      validationError: { target: false },
    });
    const foundEntity =
      identifier &&
      (await this.repo.findOne({
        [identifier]: entity[identifier],
      }));
    if (foundEntity)
      throw new Error(`The ${entity.constructor.name} already exists`);

    if (errors.length > 0) throw errors;
    return await this.repo.save(entity);
  }

  async find(): Promise<Entity[]> {
    return await this.repo.find();
  }

  async findOne(id: string | ObjectID): Promise<Entity | undefined> {
    return await this.repo.findOne(id);
  }

  async update(id: string | ObjectID, newEntity: Entity): Promise<Entity> {
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

  async delete(id: string | ObjectID): Promise<void> {
    await this.repo.delete(id);
  }
}
