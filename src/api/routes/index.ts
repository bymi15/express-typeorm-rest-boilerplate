import { Router } from 'express';
import auth from './auth';
import user from './user';
import company from './company';
import jobApplication from './jobApplication';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/company', company);
routes.use('/jobapplication', jobApplication);

export default routes;
