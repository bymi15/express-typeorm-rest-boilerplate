import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

@Entity()
export class Company {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  @Column()
  website: string;

  @Column()
  headquarters: { city: string; country: string };

  @Column()
  industry: string;

  @Column()
  foundedYear: string;

  @Column({ default: () => `now()` })
  createdAt: string;
}
