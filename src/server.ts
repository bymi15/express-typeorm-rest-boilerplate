import 'reflect-metadata';
import express from 'express';
import Logger from './logger';

const server = async () => {
  const app = express();
  try {
    const loaders = await import('./loaders');
    await loaders.default(app);
  } catch (err) {
    Logger.error(err);
    Logger.error('Loader failed. Server shutting down...');
    return;
  }
  return app;
};

export default server;
