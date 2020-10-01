import { Container } from 'typedi';
import expressLoader from './express';
import databaseLoader from './database';
import Logger from '../logger';
import { Application } from 'express';

export default async (app: Application): Promise<void> => {
  Container.set('logger', Logger);
  try {
    await databaseLoader();
  } catch (err) {
    throw err;
  }
  Logger.info('Database loaded and connected!');

  expressLoader(app);
  Logger.info('Express loaded!');
};
