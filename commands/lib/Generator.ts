// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs').promises;
import pluralize from 'pluralize';

const camelCase = (str: string): string =>
  str.charAt(0).toLowerCase() + str.slice(1);

const pluralizeLastWord = (str: string): string => {
  let foundIndex = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    if (str.charAt(i) == str.charAt(i).toUpperCase()) {
      foundIndex = i;
      break;
    }
  }
  const pluralWord = pluralize(str.substring(foundIndex));
  return str.substring(0, foundIndex) + pluralWord;
};

export default class Generator {
  private entityName: string;
  private fields: unknown;
  private entityPath = 'src/api/entities/';
  private servicePath = 'src/api/services/';
  private routePath = 'src/api/routes/';
  private factoryPath = 'src/database/factories/';
  private testPath = 'test/integration/';

  constructor(
    entityName: string,
    entityPath?: string,
    servicePath?: string,
    routePath?: string,
    factoryPath?: string,
    testPath?: string
  ) {
    this.entityName = entityName;
    this.entityPath = this.entityPath || entityPath;
    this.servicePath = this.servicePath || servicePath;
    this.routePath = this.routePath || routePath;
    this.factoryPath = this.factoryPath || factoryPath;
    this.testPath = this.testPath || testPath;
  }

  public readEntityFields = async (): Promise<unknown> => {
    const fields = {};
    try {
      const entitySource: string = await fs.readFile(
        this.entityPath + this.entityName + '.ts',
        'utf8'
      );
      const lines = entitySource.split('\n');
      let obj = null;
      for (const line of lines) {
        const ind: number = line.indexOf('?:');
        if (
          ind !== -1 &&
          line.indexOf(' id?:') === -1 &&
          line.indexOf('constructor') === -1
        ) {
          const fieldName = line.substring(0, ind).trim();
          if (line.indexOf('}') !== -1) obj = null;
          if (line.indexOf('{') === -1) {
            if (obj) {
              fields[obj][fieldName] = '';
            } else {
              fields[fieldName] = '';
            }
          } else {
            fields[fieldName] = {};
            obj = fieldName;
          }
        }
      }
    } catch (err) {
      console.log(err);
      return null;
    }
    this.fields = fields;
    return fields;
  };

  private entityCode = (fields: string): string => {
    let res =
      "import { Entity, ObjectIdColumn, Column, ObjectID } from 'typeorm';\n" +
      "import { IsString } from 'class-validator';\n" +
      '\n' +
      '@Entity()\n' +
      'export class ' +
      this.entityName +
      ' {\n' +
      '  @ObjectIdColumn()\n' +
      '  id?: ObjectID;\n';
    if (fields) {
      const fieldsArr = fields.split(' ');
      for (const field of fieldsArr) {
        res +=
          '\n' +
          '  @Column()\n' +
          '  @IsString()\n' +
          `  ${field.trim()}?: string;\n`;
      }
      res +=
        '\n' +
        `  public constructor(data?: ${this.entityName}) {\n` +
        '    if (data) {\n';
      for (const field of fieldsArr) {
        const trimmedField = field.trim();
        res += `      this.${trimmedField} = data.${trimmedField};\n`;
      }
      res += '      }\n' + '    }\n' + '  }\n';
    } else {
      res +=
        '\n' +
        '  @Column()\n' +
        '  @IsString()\n' +
        '  field?: string;\n' +
        '\n' +
        `  public constructor(data?: ${this.entityName}) {\n` +
        '    if (data) {\n' +
        '      this.field = data.field;\n' +
        '      }\n' +
        '    }\n' +
        '  }\n';
    }
    res += '}\n';
    return res;
  };

  private serviceCode = (): string => {
    return (
      "import { Inject, Service } from 'typedi';\n" +
      `import { ${this.entityName} } from '../entities/${this.entityName}';\n` +
      "import { MongoRepository } from 'typeorm';\n" +
      "import { InjectRepository } from 'typeorm-typedi-extensions';\n" +
      "import { Logger } from 'winston';\n" +
      "import CRUD from './CRUD';\n" +
      '\n' +
      '@Service()\n' +
      `export default class ${this.entityName}Service extends CRUD<${this.entityName}> {\n` +
      '  constructor(\n' +
      `    @InjectRepository(${this.entityName})\n` +
      `    protected repo: MongoRepository<${this.entityName}>,\n` +
      "    @Inject('logger')\n" +
      '    protected logger: Logger\n' +
      '  ) {\n' +
      '    super(repo, logger);\n' +
      '  }\n' +
      '\n' +
      `  async create(${camelCase(this.entityName)}: ${
        this.entityName
      }): Promise<${this.entityName}> {\n` +
      `    return await super.create(${camelCase(
        this.entityName
      )}, 'uniqueFieldName');\n` +
      '  }\n' +
      '}\n'
    );
  };

  private routeFunctionHeader = (
    method: string,
    routePath: string,
    validation?: string
  ): string => {
    if (validation) {
      return (
        `route.${method}(\n` +
        `  '${routePath}',\n` +
        '  isAuth,\n' +
        '  celebrate({\n' +
        '    body: Joi.object({\n' +
        validation +
        '    }),\n' +
        '  }),\n' +
        '  async (req, res, next) => {\n'
      );
    }

    return `route.${method}('${routePath}', isAuth, async (req, res, next) => {\n`;
  };

  private routeValidation = (fields: unknown, required?: boolean): string => {
    let res = '';
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'object' && value !== null) {
        res += `      ${key}: Joi.object({\n`;
        for (const [_key, _value] of Object.entries(value)) {
          res += `        ${_key}: Joi.string()${
            required ? '.required()' : ''
          },\n`;
        }
        res += `      })${required ? '.required()' : ''},\n`;
      } else {
        res += `      ${key}: Joi.string()${required ? '.required()' : ''},\n`;
      }
    }
    return res;
  };

  private routeCode = (fields: unknown): string => {
    return (
      "import { Router } from 'express';\n" +
      "import { Container } from 'typedi';\n" +
      "import { celebrate, Joi } from 'celebrate';\n" +
      `import ${this.entityName}Service from '../services/${this.entityName}Service';\n` +
      "import { Logger } from 'winston';\n" +
      `import { ${this.entityName} } from '../entities/${this.entityName}';\n` +
      "import { isAuth } from '../middlewares';\n" +
      '\n' +
      'const route = Router();\n' +
      '\n' +
      this.routeFunctionHeader('get', '/') +
      "  const logger: Logger = Container.get('logger');\n" +
      `  logger.debug('Calling GET to /${camelCase(
        this.entityName
      )} endpoint');\n` +
      '  try {\n' +
      `    const ${camelCase(this.entityName)}ServiceInstance = Container.get(${
        this.entityName
      }Service);\n` +
      `    const ${camelCase(
        pluralizeLastWord(this.entityName)
      )} = await ${camelCase(this.entityName)}ServiceInstance.find();\n` +
      `    return res.json(${camelCase(
        pluralizeLastWord(this.entityName)
      )}).status(200);\n` +
      '  } catch (e) {\n' +
      '    return next(e);\n' +
      '  }\n' +
      '});\n' +
      '\n' +
      this.routeFunctionHeader('get', '/:id') +
      "  const logger: Logger = Container.get('logger');\n" +
      `  logger.debug('Calling GET to /${camelCase(
        this.entityName
      )}/:id endpoint with id: %s', req.params.id);\n` +
      '  try {\n' +
      `    const ${camelCase(this.entityName)}ServiceInstance = Container.get(${
        this.entityName
      }Service);\n` +
      `    const ${camelCase(this.entityName)} = await ${camelCase(
        this.entityName
      )}ServiceInstance.findOne(req.params.id);\n` +
      `    return res.json(${camelCase(this.entityName)}).status(200);\n` +
      '  } catch (e) {\n' +
      '    return next(e);\n' +
      '  }\n' +
      '});\n' +
      '\n' +
      this.routeFunctionHeader('delete', '/:id') +
      "  const logger: Logger = Container.get('logger');\n" +
      `  logger.debug('Calling DELETE to /${camelCase(
        this.entityName
      )}/:id endpoint with id: %s', req.params.id);\n` +
      '  try {\n' +
      `    const ${camelCase(this.entityName)}ServiceInstance = Container.get(${
        this.entityName
      }Service);\n` +
      `    await ${camelCase(
        this.entityName
      )}ServiceInstance.delete(req.params.id);\n` +
      `    return res.status(204).end();\n` +
      '  } catch (e) {\n' +
      '    return next(e);\n' +
      '  }\n' +
      '});\n' +
      '\n' +
      this.routeFunctionHeader(
        'post',
        '/',
        this.routeValidation(fields, true)
      ) +
      "    const logger: Logger = Container.get('logger');\n" +
      `    logger.debug('Calling POST to /${camelCase(
        this.entityName
      )}/:id endpoint with body: %o', req.body);\n` +
      '    try {\n' +
      `      const ${camelCase(
        this.entityName
      )}ServiceInstance = Container.get(${this.entityName}Service);\n` +
      `      const ${camelCase(this.entityName)} = await ${camelCase(
        this.entityName
      )}ServiceInstance.create(\n` +
      `        new ${this.entityName}(req.body)\n` +
      '      );\n' +
      `      return res.json(${camelCase(this.entityName)}).status(201);\n` +
      '    } catch (e) {\n' +
      '      return next(e);\n' +
      '    }\n' +
      '  });\n' +
      '\n' +
      this.routeFunctionHeader('put', '/:id', this.routeValidation(fields)) +
      "    const logger: Logger = Container.get('logger');\n" +
      `    logger.debug('Calling PUT to /${camelCase(
        this.entityName
      )}/:id endpoint with body: %o', req.body);\n` +
      '    try {\n' +
      `      const ${camelCase(
        this.entityName
      )}ServiceInstance = Container.get(${this.entityName}Service);\n` +
      `      const ${camelCase(this.entityName)} = await ${camelCase(
        this.entityName
      )}ServiceInstance.update(\n` +
      `        req.params.id,\n` +
      `        new ${this.entityName}(req.body)\n` +
      '      );\n' +
      `      return res.json(${camelCase(this.entityName)}).status(200);\n` +
      '    } catch (e) {\n' +
      '      return next(e);\n' +
      '    }\n' +
      '  }\n' +
      ');\n' +
      '\n' +
      'export default route;\n'
    );
  };

  private factoryCode = (fields: unknown): string => {
    let res =
      `import { ${this.entityName} } from '../../api/entities/${this.entityName}';\n` +
      "import * as faker from 'faker';\n" +
      '\n' +
      `export default (data?: ${this.entityName}): ${this.entityName} => {\n` +
      `  const ${camelCase(this.entityName)} = new ${this.entityName}({\n`;

    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'object' && value !== null) {
        res += `    ${key}: (data && data.${key}) || {\n`;
        for (const [_key, _value] of Object.entries(value)) {
          res += `      ${_key}: faker.random.word(),\n`;
        }
        res += '    },\n';
      } else {
        res += `    ${key}: (data && data.${key}) || faker.random.word(),\n`;
      }
    }
    res += '  });\n' + `  return ${camelCase(this.entityName)};\n` + '};\n';
    return res;
  };

  private testCode = (): string =>
    "import { Container } from 'typedi';\n" +
    `import ${this.entityName}Service from '../../src/api/services/${this.entityName}Service';\n` +
    "import databaseLoader from '../../src/loaders/database';\n" +
    "import { Connection } from 'typeorm';\n" +
    "import Logger from '../../src/logger';\n" +
    `import ${this.entityName}Factory from '../../src/database/factories/${this.entityName}Factory';\n` +
    `import { ${this.entityName} } from '../../src/api/entities/${this.entityName}';\n` +
    "import EntitySeed from '../../src/database/seeds/EntitySeed';\n" +
    "import { ErrorHandler } from '../../src/helpers/ErrorHandler';\n" +
    "jest.mock('../../src/logger');\n" +
    '\n' +
    `describe('${this.entityName}Service', () => {\n` +
    '  let connection: Connection;\n' +
    `  let ${camelCase(this.entityName)}Seed: EntitySeed<${
      this.entityName
    }>;\n` +
    `  let ${camelCase(this.entityName)}ServiceInstance: ${
      this.entityName
    }Service;\n` +
    '  beforeAll(async (done) => {\n' +
    '    Container.reset();\n' +
    '    connection = await databaseLoader();\n' +
    '    await connection.synchronize(true);\n' +
    `    ${camelCase(this.entityName)}Seed = new EntitySeed<${
      this.entityName
    }>(\n` +
    `      connection.getMongoRepository(${this.entityName}),\n` +
    `      ${this.entityName}Factory\n` +
    '    );\n' +
    "    Container.set('logger', Logger);\n" +
    `    ${camelCase(this.entityName)}ServiceInstance = Container.get(${
      this.entityName
    }Service);\n` +
    '    done();\n' +
    '  });\n' +
    '\n' +
    '  beforeEach(async (done) => {\n' +
    '    await connection.dropDatabase();\n' +
    '    done();\n' +
    '  });\n' +
    '\n' +
    '  afterAll(async (done) => {\n' +
    '    if (connection.isConnected) {\n' +
    '      await connection.close();\n' +
    '    }\n' +
    '    done();\n' +
    '  });\n' +
    '\n' +
    "  describe('create', () => {\n" +
    `    test('Should successfully create a ${camelCase(
      this.entityName
    )} record', async () => {\n` +
    `      const mock${this.entityName} = ${this.entityName}Factory();\n` +
    `      const response = await ${camelCase(
      this.entityName
    )}ServiceInstance.create(mock${this.entityName});\n` +
    '\n' +
    '      expect(response).toBeDefined();\n' +
    '      expect(response.id).toBeDefined();\n' +
    '    });\n' +
    '\n' +
    `    test('Should fail to create a ${camelCase(
      this.entityName
    )} record if the ${camelCase(
      this.entityName
    )} already exists', async () => {\n` +
    `      const existing${this.entityName} = await ${camelCase(
      this.entityName
    )}Seed.seedOne();\n` +
    `      let err: ErrorHandler, response: ${this.entityName};\n` +
    '      try {\n' +
    `        response = await ${camelCase(
      this.entityName
    )}ServiceInstance.create(existing${this.entityName});\n` +
    '      } catch (e) {\n' +
    '        err = e;\n' +
    '      }\n' +
    '      expect(response).toBeUndefined();\n' +
    `      expect(err).toEqual(new ErrorHandler(400, 'The ${this.entityName} already exists'));\n` +
    '    });\n' +
    '  });\n' +
    '});\n';

  public generateEntity = async (fields: string): Promise<string> => {
    const filePath: string = this.entityPath + this.entityName + '.ts';
    await fs.writeFile(filePath, this.entityCode(fields));
    return filePath;
  };

  public generateService = async (): Promise<string> => {
    const filePath: string = this.servicePath + this.entityName + 'Service.ts';
    await fs.writeFile(filePath, this.serviceCode());
    return filePath;
  };

  public generateRoute = async (): Promise<string> => {
    const fields = this.fields || (await this.readEntityFields());
    const filePath: string =
      this.routePath + camelCase(this.entityName) + '.ts';
    await fs.writeFile(filePath, this.routeCode(fields));
    return filePath;
  };

  public generateFactory = async (): Promise<string> => {
    const fields = this.fields || (await this.readEntityFields());
    const filePath: string = this.factoryPath + this.entityName + 'Factory.ts';
    await fs.writeFile(filePath, this.factoryCode(fields));
    return filePath;
  };

  public generateTest = async (): Promise<string> => {
    const filePath: string =
      this.testPath + camelCase(this.entityName) + 'Service.spec.ts';
    await fs.writeFile(filePath, this.testCode());
    return filePath;
  };
}
