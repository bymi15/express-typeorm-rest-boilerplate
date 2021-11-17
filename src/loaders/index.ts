import { Application } from 'express';
import { Container } from 'typedi';
import Logger from '../logger';
import databaseLoader from './database';
import expressLoader from './express';

export default async (app: Application): Promise<void> => {
  Container.set('logger', Logger);
  try {
    await databaseLoader();
  } catch (err) {
    Logger.error(err);
    throw err;
  }
  Logger.info('Database loaded and connected!');

  expressLoader(app);
  Logger.info('Express loaded!');
};
