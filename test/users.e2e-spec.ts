import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'jin@seok.com',
  password: '12345',
};

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let verificationsRepository: Repository<Verification>;
  let jwtToken: string;

  const baseTest = (): request.Test =>
    request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string): request.Test =>
    baseTest().send({ query });
  const privateTest = (query: string): request.Test =>
    baseTest().set('X-JWT', jwtToken).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // whole app module
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationsRepository = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    it('should create account', () => {
      return publicTest(`
          mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
              role: Owner
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
    it('should fail if account already exists', () => {
      return publicTest(`
          mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
              role: Owner
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { createAccount },
            },
          } = res;
          expect(createAccount.ok).toBe(false);
          expect(createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    // it should get token
    it('should login with correct credentials', () => {
      return publicTest(`
          mutation {
            login(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
            }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });
    it('should not be able to login with wrong credentials', () => {
      return publicTest(`
          mutation {
            login(input: {
              email: "${testUser.email}",
              password: "WRONG!",
            }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('비밀번호가 일치하지 않습니다.');
          expect(login.token).toBe(null);
        });
    });
  });

  describe('userProfile', () => {
    let userId: number;

    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });

    it("should see a user's profile", () => {
      return privateTest(`
          {
            userProfile(userId: ${userId}) {
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { userProfile },
            },
          } = res;
          expect(userProfile.ok).toBe(true);
          expect(userProfile.error).toBe(null);
          expect(userProfile.user.id).toBe(userId);
        });
    });
    it('should not find a profile', () => {
      return privateTest(`
        {
          userProfile(userId: 9999) {
            ok
            error
            user {
              id
            }
          }
        }`)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { userProfile },
            },
          } = res;
          expect(userProfile.ok).toBe(false);
          expect(userProfile.error).toBe('사용자를 찾을 수 없습니다.');
          expect(userProfile.user).toBe(null);
        });
    });
  });

  describe('me', () => {
    //test AuthGuard
    it('should find my profile', () => {
      return privateTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { me },
            },
          } = res;
          expect(me.email).toBe(testUser.email);
        });
    });
    it('should not allow logged out user', () => {
      return publicTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: { errors },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    const NEW_EMAIL = 'new@email.com';
    it('should change email', () => {
      return privateTest(`
          mutation {
            editProfile(input: {
              email: "${NEW_EMAIL}"
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { editProfile },
            },
          } = res;
          expect(editProfile.ok).toBe(true);
          expect(editProfile.error).toBe(null);
        });
    });
    it('should have new email', () => {
      return privateTest(`
            {
              me {
                email
              }
            }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { me },
            },
          } = res;
          expect(me.email).toBe(NEW_EMAIL);
        });
    });
    it('should fail if email is duplicated', () => {
      return privateTest(`
          mutation {
            editProfile(input: {
              email: "${NEW_EMAIL}"
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { editProfile },
            },
          } = res;
          expect(editProfile.ok).toBe(false);
          expect(editProfile.error).toBe('이미 사용 중인 이메일입니다.');
        });
    });
  });

  describe('verifyEmail', () => {
    let verificationCode: string;
    beforeAll(async () => {
      const [verification] = await verificationsRepository.find();
      verificationCode = verification.code;
    });
    it('should verify email', () => {
      return publicTest(`
          mutation {
            verifyEmail(input: { code: "${verificationCode}" }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { verifyEmail },
            },
          } = res;
          expect(verifyEmail.ok).toBe(true);
          expect(verifyEmail.error).toBe(null);
        });
    });

    it('should fail on verification code not found', () => {
      return publicTest(`
          mutation {
            verifyEmail(input: { code: "WRONG CODE!" }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: { verifyEmail },
            },
          } = res;
          expect(verifyEmail.ok).toBe(false);
          expect(verifyEmail.error).toBe('잘못된 인증코드입니다.');
        });
    });
  });
});
