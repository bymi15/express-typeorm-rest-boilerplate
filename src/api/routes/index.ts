import { Router } from 'express';
import auth from './auth';
import user from './user';
import company from './company';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/company', company);

export default routes;
