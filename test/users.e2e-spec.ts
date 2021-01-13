import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { AppModule } from '../src/app.module';

describe('UsersModule (e2e)', () => {
  let app: INestApplication;

  // migrate
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // whole app module
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  // clear
  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  it.todo('createAccount');
  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
