import { MongoRepository } from 'typeorm';
import { Factory } from '../../types';

export default class EntitySeed<Entity> {
  private repo: MongoRepository<Entity>;
  private factory: Factory<Entity>;

  constructor(repo: MongoRepository<Entity>, factory: Factory<Entity>) {
    this.repo = repo;
    this.factory = factory;
  }

  public async seedOne(data?: Entity): Promise<Entity> {
    const ent = await this.factory(data);
    await this.repo.save(ent);
    return ent;
  }

  public async seedMany(amount: number, data?: Entity): Promise<Entity[]> {
    const res: Entity[] = [];
    for (let i = 0; i < amount; i++) {
      res[i] = await this.factory(data);
      await this.repo.save(res[i]);
    }
    return res;
  }
}
