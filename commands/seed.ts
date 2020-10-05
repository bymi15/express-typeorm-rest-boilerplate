import commander from 'commander';
import databaseLoader from '../src/loaders/database';
import EntitySeed from '../src/database/seeds/EntitySeed';
import { User } from '../src/api/entities/User';
import { Company } from '../src/api/entities/Company';
import CompanyFactory from '../src/database/factories/CompanyFactory';
import UserFactory from '../src/database/factories/UserFactory';

commander
  .version('1.0.0')
  .description('Run seeders to fill your database with mock data')
  .option('-u, --user <number>', 'seed user <number> times', parseInt, 0)
  .option('-c, --company <number>', 'seed company <number> times', parseInt, 0)
  .parse(process.argv);

const run = async () => {
  const log = console.log;
  try {
    const connection = await databaseLoader();
    log('Database connection loaded successfully!');

    const users = await new EntitySeed(
      connection.getMongoRepository(User),
      UserFactory
    ).seedMany(commander.user);
    log(`${users.length} users created!`);

    const companies = await new EntitySeed(
      connection.getMongoRepository(Company),
      CompanyFactory
    ).seedMany(commander.company);
    log(`${companies.length} companies created!`);
  } catch (err) {
    handleError(err);
  }
  process.exit(0);
};

const handleError = (err: Error) => {
  console.error(err);
  process.exit(1);
};

run();
