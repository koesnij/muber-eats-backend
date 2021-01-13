import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';

describe('UsersModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // whole app module
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it.todo('me');
  it.todo('UserProfile');
  it.todo('createAccount');
  it.todo('Login');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
