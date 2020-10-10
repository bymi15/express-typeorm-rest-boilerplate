import server from './server';
import config from './config';
import Logger from './logger';

const startServer = async () => {
  const app = await server();

  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      #  Server listening on port: ${config.port}    
      ################################################
    `);
  });
};

startServer();
