import Generator from './lib/Generator';
import commander from 'commander';

let gen: Generator;
const log = console.log;

commander
  .version('1.0.0')
  .command('entity <entityName>')
  .description('Entity class code generator')
  .option('-f, --fields <fields>', 'generate space-separated string fields')
  .action(async (entityName: string, options: { fields: string }) => {
    log(`Generating ${entityName} entity file...`);
    gen = new Generator(entityName);
    const fields = options.fields;
    log(fields);
    try {
      const filePath = await gen.generateEntity(fields);
      log(`${entityName} entity has been generated successfully!`);
      log(`Path: ${filePath}`);
    } catch (err) {
      log(err);
    }
  })
  .outputHelp(
    () =>
      'Usage: npm run generate entity [EntityName] -- -f "field1 field2 field3 ..."\n'
  );

commander
  .command('all <entityName>')
  .description(
    'Boilerplate code generator for existing Entity (Service, Factory, Route, Test)'
  )
  .action(async (entityName: string) => {
    log(`Generating service, factory, route, test for ${entityName}...`);
    gen = new Generator(entityName);
    try {
      let filePath = await gen.generateService();
      log('Service has been generated successfully!');
      log(`Path: ${filePath}\n`);

      filePath = await gen.generateRoute();
      log('Route has been generated successfully!');
      log(`Path: ${filePath}\n`);

      filePath = await gen.generateFactory();
      log('Factory has been generated successfully!');
      log(`Path: ${filePath}\n`);

      filePath = await gen.generateTest();
      log('Test has been generated successfully!');
      log(`Path: ${filePath}`);
    } catch (err) {
      log(err);
    }
  })
  .outputHelp(() => 'Usage: npm run generate all [EntityName]\n\n');

commander.parse(process.argv);
