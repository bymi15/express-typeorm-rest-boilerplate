import { Entity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { Company } from './Company';
import { User } from './User';

@Entity()
export class JobApplication {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  @IsString()
  role?: string;

  @Column()
  @IsString()
  description?: string;

  @Column()
  @IsNotEmpty()
  company?: ObjectID | Company;

  @Column()
  @IsNotEmpty()
  user?: ObjectID | User;

  @Column()
  @IsString()
  status?: string;

  @Column()
  @IsString()
  appliedDate?: string;

  @Column()
  createdAt?: string = new Date().toISOString();

  @Column()
  updatedAt?: string;

  public constructor(data?: JobApplication) {
    if (data) {
      this.role = data.role;
      this.description = data.description;
      this.company = data.company;
      this.user = data.user;
      this.status = data.status;
      this.appliedDate = data.appliedDate;
      this.updatedAt = new Date().toISOString();
    }
  }
}
