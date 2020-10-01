import 'reflect-metadata';
import express from 'express';
import Logger from './logger';
import config from './config';

const startServer = async () => {
  const app = express();
  try {
    const loaders = await import('./loaders');
    await loaders.default(app);
  } catch (err) {
    Logger.error('Loader failed. Server shutting down...');
    return;
  }

  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      #  Server listening on port: ${config.port}    
      ################################################
    `);
  });
};

startServer();
