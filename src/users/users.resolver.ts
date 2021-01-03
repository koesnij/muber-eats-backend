import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {} // inject UsersService
  @Query(returns => Boolean)
  hi() {
    return true;
  }
  @Mutation(returns => CreateAccountOutput)
  createAccount(@Args('input') createAccountInput: CreateAccountInput) {}
}
