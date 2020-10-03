import jwt from 'express-jwt';
import { User } from '../api/entities/User';

declare global {
  namespace Express {
    export interface Request {
      currentUser: User;
      token: Token;
    }
  }
}

export type Token = jwt.Options;

export type Factory<Entity> = (data?: Entity) => Promise<Entity> | Entity;

export interface IUserInputDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserResponseDTO {
  user: User;
  token: string;
}
