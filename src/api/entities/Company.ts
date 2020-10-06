import { Entity, ObjectIdColumn, Column, Index, ObjectID } from 'typeorm';
import { IsUrl, IsString, IsNumberString } from 'class-validator';

@Entity()
export class Company {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  @IsString()
  @Index({ unique: true })
  name?: string;

  @Column()
  description?: string;

  @Column()
  @IsUrl()
  logo?: string;

  @Column()
  @IsUrl()
  website?: string;

  @Column()
  headquarters?: { city?: string; country?: string };

  @Column()
  @IsString()
  industry?: string;

  @Column()
  @IsNumberString()
  foundedYear?: string;

  public constructor(data?: Company) {
    if (data) {
      this.name = data.name;
      this.description = data.description;
      this.logo = data.logo;
      this.website = data.website;
      this.headquarters = data.headquarters;
      this.industry = data.industry;
      this.foundedYear = data.foundedYear;
    }
  }
}
