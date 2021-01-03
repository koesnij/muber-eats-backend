import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: '해당 이메일을 가진 사용자가 이미 존재합니다.',
        };
      }
      // Entity Instance를 create()할 때 @BeforeInsert가 실행
      await this.users.save(this.users.create({ email, password, role })); // return nothing
      return { ok: true };
    } catch (error) {
      // make error
      return { ok: false, error: "Couldn't create account" };
    }
  }
}
