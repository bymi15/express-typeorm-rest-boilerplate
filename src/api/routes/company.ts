import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import CompanyService from '../services/company';
import { Logger } from 'winston';
import { Company } from '../entities/Company';
import { isAuth } from '../middlewares';

const route = Router();

route.get('/', isAuth, async (req, res, next) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling GET to /company endpoint');
  try {
    const companyServiceInstance = Container.get(CompanyService);
    const companies = await companyServiceInstance.find();
    return res.json({ companies }).status(200);
  } catch (e) {
    return next(e);
  }
});

route.get('/:id', isAuth, async (req, res, next) => {
  const companyId = req.params.id;
  const logger: Logger = Container.get('logger');
  logger.debug('Calling GET to /company/:id endpoint with id: %s', companyId);
  try {
    const companyServiceInstance = Container.get(CompanyService);
    const company = await companyServiceInstance.findOne(companyId);
    return res.json({ company }).status(200);
  } catch (e) {
    return next(e);
  }
});

route.post(
  '/',
  isAuth,
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      logo: Joi.string().required(),
      website: Joi.string().required(),
      headquarters: Joi.object({
        city: Joi.string().required(),
        country: Joi.string().required(),
      }).required(),
      industry: Joi.string().required(),
      foundedYear: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling POST to /company endpoint with body: %o', req.body);
    try {
      const companyServiceInstance = Container.get(CompanyService);
      const company = await companyServiceInstance.create(
        new Company(req.body)
      );
      return res.status(201).json({ company });
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
