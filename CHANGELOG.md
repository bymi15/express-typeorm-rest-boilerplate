## [0.4.3](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.4.2...v0.4.3) (2021-11-17)


### Bug Fixes

* **CRUD:** fix update function ([a95ad55](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/a95ad550746483649d387162d18bd41df03ace5f))
* **express:** replace map with foreach ([3338f60](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/3338f60a9b6fb66ddbb1b14648b01fce69a7bc17))

## [0.4.2](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.4.1...v0.4.2) (2020-10-16)


### Bug Fixes

* **CRUD:** fix update CRUD method ([31a79a4](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/31a79a4bdd977119a9636afcc764193bd573a565))
* **jobApplicationRoute:** fix /:id endpoint by adding object permission ([446f31c](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/446f31c52b14137475ac0ce2f0c02f013c85ac13))

## [0.4.1](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.4.0...v0.4.1) (2020-10-11)


### Bug Fixes

* **CRUD:** make id strictly type string ([2378d4a](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/2378d4a86c24dd6fca8f0fcc6a89a950c2d630a8))
* **routes:** add checkRole('staff') middleware for delete,post,put endpoints ([b3a98bf](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/b3a98bf2b61b61038adec90ede5a2cbfd9054f9d))
* **routes:** refactor delete route status code to 204 ([56bdf83](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/56bdf83560030d0fcab1abb8fb978a7b13b46f0f))
* **UserFactory:** add user role ([6a026f7](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/6a026f78cea5bb520ff2e6bb7e9c1789beb03b30))
* **UserService:** refactor id param to be strictly of type string ([fee0993](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/fee099380fc45d5f1312319e795723f031d600ff))

# [0.4.0](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.3.0...v0.4.0) (2020-10-10)


### Bug Fixes

* **app:** separate app and server for e2e testing ([a6d2cbb](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/a6d2cbb197a03809312b2a453c198450e9b8d757))
* **ErrorHandler:** fix imports and add error handler in express loader ([5571f23](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/5571f2357eb120cc566bb1474c6ea1193ba9a362))
* **expressLoader:** add celebrate validation error handler ([f8421bc](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/f8421bca2d2168ee13a2082a5d8c6ee9d31dd526))
* **JobApplicationFactory:** fix ObjectID bug with typeorm ([8878c14](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/8878c14391d0915bfaf2c0ee3b2517143d73c88e))
* **services:** add undefined check for JobApplication service ([604c195](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/604c19568523dc3a21475658f55eacd2be141e46))


### Features

* **ErrorHandler:** add custom error handler with status code ([d742c3e](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/d742c3ec08ba9de6dc06174a10c2e0154cb82d63))

# [0.3.0](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.2.0...v0.3.0) (2020-10-06)


### Bug Fixes

* **CRUD:** fix update bug with fill ([d9a1658](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/d9a1658e4a35992c3ea07325f77135775bdba440))
* **Generator:** add missing export route code ([b6dede6](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/b6dede6d37eff6b32d1b3faea8c79b518c8464b9))
* **jest:** jest run in series instead of parallel ([57d0c6f](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/57d0c6fe57abf77f20c17946d3bab6defebafdd7))
* **JobApplication:** remove default appliedDate causing bug in update ([45ab09e](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/45ab09e161aca7caa000a0f088f21b0bd4fd7fb1))
* **ormconfig.js:** fix TS_NODE env not set ([7e615d6](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/7e615d6fe2c10cd7b26c5ba0517d5cdeae9049ee))


### Features

* **CRUD:** add fillObjectIdField function ([319588c](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/319588cbd1e196f7157fb26436db497ad01f576e))
* **factories:** add JobApplication factory ([510b0a5](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/510b0a5e0ca49afea796ca8f703003a54f581f5e))
* **JobApplication:** add JobApplication entity ([a3b2d86](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/a3b2d861270a29776e2ca3e7673ec17b70a58604))
* **jobApplicationRoute:** add jobApplication endpoints ([41b4dcb](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/41b4dcbab86eb72d690c738fd44458e8cba438f7))
* **JobApplicationService:** add update function ([0bebf19](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/0bebf19b3c2f3a8568f5011e76e0659fc31b63b5))
* **seeds:** add JobApplication seed ([cc72beb](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/cc72beb9b28a23841e3f791881dcc3925349bfa2))
* **services:** add JobApplication service ([80afac2](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/80afac28a518435116b1a103c6bbcd242cd9a4ec))

# [0.2.0](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.1.1...v0.2.0) (2020-10-06)


### Bug Fixes

* **companyroute:** refactor response json format ([d9dd2bd](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/d9dd2bd7e0ee2baba8fafa9785b0c79432196628))
* **CRUD:** make identifier optional in create function ([7b6e584](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/7b6e5849b5f617d057d8a4f634635f36fbc30891))
* **generator:** refactor route code generator response json format ([5026a5f](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/5026a5fe53b86848bac01037899271553868c6dd))
* **middlewares:** add checkRole to middleware index ([f9813b6](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/f9813b694cb008a2e1b3a169f42a0cecacbd6695))
* **middlewares:** refactor attachUser to use UserService findOne ([9249b5a](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/9249b5af27b1c016f84b2959c0c4b03613c8dd55))


### Features

* **middlewares:** add checkRole middleware ([0f0bd5b](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/0f0bd5bb961ad1b6f525a6e14c0a0e44fc86c748))
* **services:** add UserService find and findOne which removes password field ([994c370](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/994c37045a2b94a67807768311eec4b101e18313))
* **UserEntity:** add role ([88ad053](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/88ad05358a1c3f7024360b64807071f7912cca45))
* **userRoute:** add / and /current endpoints to user route ([42324c5](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/42324c5d0f0c8d9bd0e15fcf776144c5f6fc3637))

## [0.1.1](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.1.0...v0.1.1) (2020-10-05)


### Bug Fixes

* **build:** fix running compiled app by adding ormconfig for dist ([811423f](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/811423fe2b179812176a4864e7ae4378cedc9d1d))
* **package.json:** fix test env variable for ormconfig in build ([308fd37](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/308fd3755119634620e6f732011c33c82dd44540))

# [0.1.0](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.0.4...v0.1.0) (2020-10-05)


### Bug Fixes

* **.releaserc:** fix semantic-release branch was set to master instead of main ([5a752c5](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/5a752c5f5d0b0e80025d0549cf48fd42b7017bcd))


### Features

* **package.json:** add husky and commitlint ([7946e6a](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/7946e6a57dc5e790e38c72709e0eebaf0523bde6))


# [0.0.4](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.0.3...v0.0.4) (2020-10-05)


### Features

* **commands:** add seed command ([8d282da](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/8d282daae3edd8ac724f3499d9bb8c7e8110de05))
* **companyRoute:** add delete and update endpoints ([70b3d93](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/70b3d93474054085c1fa000cfb25ce5f21aad093))
* **Generator:** add generate command ([e00b2b5](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/e00b2b5db269d5596ea599ea005c04455a95511c))


# [0.0.3](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.0.2...v0.0.3) (2020-10-03)


### Bug Fixes

* **database:** rename case-sensitive ([223a854](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/223a854ac229cec128e18ad7ca6b00dafcb610fd))


### Features

* **CRUD:** add and integrate generic CRUD service ([e6233b3](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/e6233b33a3b5dfc0e429ffa6218793c10ad45708))
* **CRUD.spec.ts:** add CRUD service integration test ([8848538](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/8848538c8c50901909f57d40cccee4bbec3241ac))
* **EntitySeed:** add generic entity seeder ([0429230](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/0429230aad24c20e3a1538653f0d644e65211203))
* **issues:** update issue templates ([7c26510](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/7c265109002279a4930644d1e6cf765b254c54c4))
* **test:** update company and user tests ([32b2b8a](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/32b2b8a61f05473b509c6c25fb565228a626ba7e))
* **types:** add generic factory type ([5242ff8](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/5242ff8ee659490b9fc19d4e7d5be80e40d98a56))


# [0.0.2](https://github.com/bymi15/express-typeorm-rest-boilerplate/compare/v0.0.1...v0.0.2) (2020-10-02)


### Bug Fixes

* **config:** remove .env check ([bd47140](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/bd47140a762cd591e93b935e8808c4bae7a8e7d8))
* **tests:** fix userService jest mock logger path ([6fced9f](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/6fced9fa0b199319a9c12e30cd0e4983ec938919))
* update travis config and package.json for ci ([86795fc](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/86795fc9d6e1522b03da0cf17e37f44c57acd1dd))


### Features

* **.travis.yml:** add travis config ([52c35b9](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/52c35b94f259e7a0d3e7652cb7414e9c4d2b5795))
* **CompanyFactory:** add company factory ([d2fa5f2](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/d2fa5f294b24b998bd94d5c1d8efd47a1b442d85))
* **CompanySeed:** add company seeder ([38c9636](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/38c963642cea339b71eac9ee84d6e6f4d002d043))
* **entities:** add Company entity ([87c06a3](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/87c06a3d17eca9905505952baf6bad3d4bee81e1))
* **routes:** add company route ([d213994](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/d21399460c0343bfed556b443fac4fc0201397f4))
* **services:** add company service ([42c4b46](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/42c4b46a146930eedf0733800818be6caa8db45c))
* **test:** add companyService integration test ([e72c56d](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/e72c56d60915d871341b6bf3cace94e82059623c))
* **types:** add ICompanyInputDTO interface ([396fabf](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/396fabfb55e80e68057ff84d0242d652473e0e93))


# 0.0.1 (2020-10-01)


### Features

* add app ([794b994](https://github.com/bymi15/express-typeorm-rest-boilerplate/commit/794b9947d0ad2d1173eb1f1ae35473644b0fafd2))
