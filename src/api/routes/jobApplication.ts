import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import JobApplicationService from '../services/JobApplicationService';
import { Logger } from 'winston';
import { JobApplication } from '../entities/JobApplication';
import { attachUser, isAuth } from '../middlewares';
import { User } from '../entities/User';
import CompanyService from '../services/CompanyService';

const route = Router();

route.get('/', isAuth, async (req, res, next) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling GET to /jobApplication endpoint');
  try {
    const jobApplicationServiceInstance = Container.get(JobApplicationService);
    const jobApplications = await jobApplicationServiceInstance.find();
    return res.json(jobApplications).status(200);
  } catch (e) {
    return next(e);
  }
});

route.get('/:id', isAuth, async (req, res, next) => {
  const logger: Logger = Container.get('logger');
  logger.debug(
    'Calling GET to /jobApplication/:id endpoint with id: %s',
    req.params.id
  );
  try {
    const jobApplicationServiceInstance = Container.get(JobApplicationService);
    const jobApplication = await jobApplicationServiceInstance.findOne(
      req.params.id
    );
    return res.json(jobApplication).status(200);
  } catch (e) {
    return next(e);
  }
});

route.delete('/:id', isAuth, attachUser, async (req, res, next) => {
  const logger: Logger = Container.get('logger');
  logger.debug(
    'Calling DELETE to /jobApplication/:id endpoint with id: %s',
    req.params.id
  );
  try {
    const jobApplicationServiceInstance = Container.get(JobApplicationService);
    const jobUser = (await jobApplicationServiceInstance.findOne(req.params.id))
      .user as User;
    if (!jobUser.id.equals(req.currentUser.id)) return res.sendStatus(403);
    await jobApplicationServiceInstance.delete(req.params.id);
    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

route.post(
  '/',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      role: Joi.string().required(),
      description: Joi.string().required(),
      company: Joi.string().required(),
      status: Joi.string().required(),
      appliedDate: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug(
      'Calling POST to /jobApplication/:id endpoint with body: %o',
      req.body
    );
    try {
      const jobApplicationServiceInstance = Container.get(
        JobApplicationService
      );
      req.body.company = (
        await Container.get(CompanyService).findOne(req.body.company)
      ).id;
      req.body.user = req.currentUser.id;
      const jobApplication = await jobApplicationServiceInstance.create(
        new JobApplication(req.body)
      );
      return res.json(jobApplication).status(201);
    } catch (e) {
      return next(e);
    }
  }
);

route.put(
  '/:id',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      role: Joi.string(),
      description: Joi.string(),
      status: Joi.string(),
      appliedDate: Joi.string(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug(
      'Calling PUT to /jobApplication/:id endpoint with body: %o',
      req.body
    );
    try {
      const jobApplicationServiceInstance = Container.get(
        JobApplicationService
      );
      const jobUser = (
        await jobApplicationServiceInstance.findOne(req.params.id)
      ).user as User;
      if (!jobUser.id.equals(req.currentUser.id)) return res.sendStatus(403);
      const jobApplication = await jobApplicationServiceInstance.update(
        req.params.id,
        new JobApplication(req.body)
      );
      return res.json(jobApplication).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
