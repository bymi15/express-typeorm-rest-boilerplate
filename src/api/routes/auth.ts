import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import UserService from '../services/UserService';
import { Logger } from 'winston';

const route = Router();

route.post(
  '/register',
  celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling /register endpoint with body: %o', req.body);
    try {
      const userServiceInstance = Container.get(UserService);
      const { user, token } = await userServiceInstance.register(req.body);
      return res.status(201).json({ user, token });
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  '/login',
  celebrate({
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling /login endpoint with email: %s', req.body.email);
    try {
      const userServiceInstance = Container.get(UserService);
      const { user, token } = await userServiceInstance.login(
        req.body.email,
        req.body.password
      );
      return res.json({ user, token }).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
