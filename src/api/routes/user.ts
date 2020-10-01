import { Request, Response, Router } from 'express';
import { isAuth, attachUser } from '../middlewares';

const route = Router();

route.get('/', isAuth, attachUser, (req: Request, res: Response) => {
  return res.json({ user: req.currentUser }).status(200);
});

export default route;
