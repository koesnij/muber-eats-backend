import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
  /* Dynamic Module은 단지 또 다른 Module을 반환해주는 Module이다  */
  static forRoot(): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [JwtService],
    }; /* Dynamic Module */
  }
}
