import jwt from 'express-jwt';
import { User } from '../api/entities/User';

declare global {
  namespace Express {
    export interface Request {
      currentUser: User;
      token: Token;
    }
  }

  export type Token = jwt.Options;
}
