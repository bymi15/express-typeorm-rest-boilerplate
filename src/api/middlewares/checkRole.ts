import { Container } from 'typedi';
import { Logger } from 'winston';
import { Response, NextFunction, Request, RequestHandler } from 'express';
import { User, Role } from '../entities/User';
import UserService from '../services/UserService';

const checkRole = (role: Role): RequestHandler => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> => {
  const logger: Logger = Container.get('logger');
  try {
    const userService = Container.get(UserService);
    const userEntity: User = await userService.findOne(req.token.id);
    if (!userEntity) {
      return res.sendStatus(401);
    }
    if (!userEntity.hasAccessTo(role)) {
      return res.sendStatus(403);
    }
    return next();
  } catch (e) {
    logger.error('Error checking user role: %o', e);
    return next(e);
  }
};

export default checkRole;
