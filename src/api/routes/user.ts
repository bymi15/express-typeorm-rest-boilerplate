import { NextFunction, Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { isAuth, attachUser, checkRole } from '../middlewares';
import UserService from '../services/UserService';

const route = Router();

route.get(
  '/',
  isAuth,
  checkRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling GET /user endpoint');
    try {
      const userServiceInstance = Container.get(UserService);
      const users = await userServiceInstance.find();
      return res.json(users).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/current', isAuth, attachUser, (req: Request, res: Response) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling GET /user/current endpoint');
  return res.json({ user: req.currentUser }).status(200);
});

export default route;
