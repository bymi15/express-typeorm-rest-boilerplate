<h1 align="center">Express TypeORM REST API Boilerplate</h1>

<p align="center">
  <a href="https://sonarcloud.io/dashboard?id=bymi15_express-typeorm-rest-boilerplate">
      <img src="https://sonarcloud.io/api/project_badges/measure?project=bymi15_express-typeorm-rest-boilerplate&metric=alert_status" alt="Quality Gate Status" />
  </a>
  <a href="https://travis-ci.com/github/bymi15/express-typeorm-rest-boilerplate">
    <img src="https://api.travis-ci.com/bymi15/express-typeorm-rest-boilerplate.svg?branch=main" alt="travis" />
  </a>
  <a href="https://stackshare.io/bymi15/express-typeorm-rest-boilerplate">
    <img src="http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="stackshare" />
  </a>
  <a href="https://www.npmjs.com/package/express-typeorm-rest-boilerplate">
    <img src="https://img.shields.io/npm/v/express-typeorm-rest-boilerplate?color=brightgreen&style=flat-squaret" alt="npm" />
  </a>
</p>

<p align="center">
  <b>Awesome boilerplate code to get started with building RESTful API Services!</b></br>
  <span><a href="https://www.typescriptlang.org/">Typescript</a> with <a href="https://nodejs.org/">NodeJS</a> and <a href="https://expressjs.com/">Express</a> as well as <a href="https://www.mongodb.com/">MongoDB</a> integration with <a href="https://github.com/typeorm/typeorm">TypeORM</a></br>
  <b>JSON Web Tokens (JWT)</b> based User Authentication,</span></br>
  <a href="https://github.com/typestack/typedi">TypeDI</a><span> dependency injections, testing with <a href="https://jestjs.io/">Jest</a>, and a bunch more.</span></br>
  <sub>Made with ❤️ by <a href="https://github.com/bymi15">Brian Min</a></sub>
</p>

<br />

## Why?

The main reason I decided to start this project is to provide a boilerplate for the NodeJS, Express, Typescript, TypeORM, MongoDB stack.
Also with TypeORM, this boilerplate code can easily be modified to use MySQL, PostGreSQL, and many more.
Tedious setting up of project structure, logging, testing, env and eslint is all done for you!
Now you can focus on actually implementing the core functionalities and not spending hours setting up and configuring your project.

Try it out and feel free to raise any issues or create pull requests if you would like to contribute!

### Features

- **JWT based user authentication** with [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) and [express-jwt](https://github.com/auth0/express-jwt).
- **Dependency Injection** with [TypeDI](https://github.com/typestack/typedi).
- **ORM with support for many databases (MySQL, PostgreSQL, MariaDB, SQLite, MongoDB, and more)** with [TypeORM](https://github.com/typeorm/typeorm).
- **Clear and organised structure** with different layers such as entities, services, middlewares, loaders, etc.
- **Validation** thanks to [class-validator](https://github.com/typestack/class-validator).
- **Unit and Integration Testing** with [Jest](https://jestjs.io/).
- **Security Features** with [Helmet](https://helmetjs.github.io/).
- **Role-based access control** using a custom-built middleware.
- **Simple Data Seeding** with custom-built factories and [Faker.js](https://www.npmjs.com/package/faker).
- **Code generator for entity, service, route, factory, seed, test** with a custom-built generator script and CLI tool [Commander](https://github.com/tj/commander.js/).

## Getting Started

### Step 1: Set up the Development Environment

Install [Node.js and NPM](https://nodejs.org/en/download/)

Install a [MongoDB server](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 2: Create a new project

Fork or download this project and modify `package.json` for your new project.

Make a copy of the `.env.example` file and rename it to `.env`.

Create a new database and add the connection string in the `.env` file.

Install the required packages.

```bash
npm install
```

> This installs all the dependencies with NPM.

Now your development environment should be ready to use!

### Step 3: Serve your application

Go to the root directory and start your app with this npm script.

```bash
npm run dev
```

> This starts a local server using `nodemon` and `ts-node`.
> The server base endpoint will be `http://127.0.0.1:3000` where `3000` is the PORT variable you set in the `.env` file.

## Scripts and Tasks

### Install

- Install all dependencies with `npm install`

### Linting

- Run code syntax and format checking using `npm run lint` which runs eslint.
- Automatically fix lint errors with `npm run lint:fix`.

### Running MongoDB locally

For this step you need to install [MongoDB Server](https://www.mongodb.com/try/download/community)

- Run `npm run mongodb` to start a local MongoDB server with it's data stored in `.mongodb` in the root directory.
- This is very useful for unit / integration testing.
- It's always a good idea to use a separate database for testing.

### Tests

- Run unit tests using `npm run test` (for Windows users) or `npm run test:unix` (for Mac and Linux users).

### Running the app in development

- Run `npm run dev` to start nodemon with ts-node.
- The server base endpoint will be `http://127.0.0.1:3000` where `3000` is the PORT variable you set in the `.env` file.

### Building and running the app in production

- Run `npm run build` to compile all the Typescript sources and generate JavaScript files.
- To start the built app located in `build` use `npm start`.

## API Routes

The route prefix is `/api` by default, but you can change this in the .env file.

| Route                   | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| **/api**                | Base endpoint                                            |
| **/api/auth/login**     | Auth - login endpoint                                    |
| **/api/auth/register**  | Auth - register endpoint                                 |
| **/api/user**           | Example entity endpoint - returns all users              |
| **/api/user/current**   | Example entity endpoint - returns current logged in user |
| **/api/company**        | Example entity endpoint - returns all companies          |
| **/api/company/:id**    | Example entity endpoint - returns a company by id        |
| **/api/jobApplication** | Example entity endpoint - returns all job applications   |
| ...                     | ...                                                      |

## Project Structure

| Name                       | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| **.mongodb/**              | Local MongoDB server data                                    |
| **build/**                 | Compiled source files will be placed here                    |
| **commands/**              | Custom CLI command tools used with npm scripts               |
| **src/**                   | Source files                                                 |
| **src/api/middlewares/**   | Custom middlewares                                           |
| **src/api/entities/**      | TypeORM Entities (Database models)                           |
| **src/api/services/**      | Service layer                                                |
| **src/config/**            | The configuration file which loads env variables             |
| **src/database/factories** | Factories generate entities with mock data                   |
| **src/database/seeds**     | Seeds use factories to save mock data in the database        |
| **src/loaders/**           | Loader is where the app is configured and database is loaded |
| **src/types/** \*.d.ts     | Custom type definitions                                      |
| **test** \*.spec.ts        | Unit and integration tests                                   |
| .env.example               | Environment configurations                                   |

## Logging

For logging we use [winston](https://github.com/winstonjs/winston).

## License

[MIT](/LICENSE)
