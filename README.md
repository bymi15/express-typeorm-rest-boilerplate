<h1 align="center">Express TypeORM REST API Boilerplate</h1>

<p align="center">
  <a href="https://travis-ci.com/github/bymi15/express-typeorm-rest-boilerplate">
    <img src="https://api.travis-ci.com/bymi15/express-typeorm-rest-boilerplate.svg?branch=main" alt="travis" />
  </a>
</p>

<p align="center">
  <b>Awesome boilerplate code to get started with building RESTful API Services!</b></br>
  <span>Comes with JWT User Authentication, MongoDB integration with <a href="https://github.com/typeorm/typeorm">TypeORM</a>, </span></br>
  <span>dependency injections with <a href="https://github.com/typestack/typedi">TypeDI</a>, and a sample unit test with <a href="https://jestjs.io/">Jest</a></span></br>
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
- **Simple Data Seeding** with custom-built factories and [Faker.js](https://www.npmjs.com/package/faker).

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

- Run `npm run mongodb` to start a local MongoDB server with it's data stored in `.mongodb` in the root directory.
- This is very useful for unit / integration testing.
- It's always a good idea to use a separate database for testing.

### Tests

- Run unit tests using `npm run test`.
- If you're NOT using Windows, make sure you change the `test` script in `package.json` to set `NODE_ENV` to `test` before running `jest`.

### Running the app in development

- Run `npm run dev` to start nodemon with ts-node.
- The server base endpoint will be `http://127.0.0.1:3000` where `3000` is the PORT variable you set in the `.env` file.

### Building and running the app in production

- Run `npm run build` to compile all the Typescript sources and generate JavaScript files.
- To start the built app located in `build` use `npm start`.

## API Routes

The route prefix is `/api` by default, but you can change this in the .env file.

| Route                  | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| **/api**               | Base endpoint                                            |
| **/api/auth/login**    | Auth - login endpoint                                    |
| **/api/auth/register** | Auth - register endpoint                                 |
| **/api/user**          | Example entity endpoint - returns current logged in user |

## Project Structure

| Name                       | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| **.mongodb/**              | Local MongoDB server data                                    |
| **build/**                 | Compiled source files will be placed here                    |
| **src/**                   | Source files                                                 |
| **src/api/middlewares/**   | Custom middlewares                                           |
| **src/api/entities/**      | TypeORM Entities (Database models)                           |
| **src/api/services/**      | Service layer                                                |
| **src/config/**            | The configuration file which loads env variables             |
| **src/database/factories** | Factories generate entities with mock data                   |
| **src/database/seeds**     | Seeds use factories to save mock data in the database        |
| **src/loaders/**           | Loader is where the app is configured and database is loaded |
| **src/types/** \*.d.ts     | Custom type definitions                                      |
| **tests** \*.spec.ts       | Unit and integration tests                                   |
| .env.example               | Environment configurations                                   |

## Logging

For logging we use [winston](https://github.com/winstonjs/winston).

## License

[MIT](/LICENSE)
