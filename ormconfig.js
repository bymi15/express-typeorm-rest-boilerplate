/* eslint-disable @typescript-eslint/no-var-requires */
const config = process.env.TS_NODE
  ? require('./src/config').default
  : require('./dist/config').default;

const srcConfig = {
  type: 'mongodb',
  url: config.databaseURL,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: false,
  entities: ['src/api/entities/**/*.ts'],
  cli: {
    entitiesDir: 'src/api/entities',
  },
};

const distConfig = {
  type: 'mongodb',
  url: config.databaseURL,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: false,
  logging: false,
  entities: ['dist/api/entities/**/*.js'],
  cli: {
    entitiesDir: 'dist/api/entities',
  },
};

module.exports = process.env.TS_NODE ? srcConfig : distConfig;
