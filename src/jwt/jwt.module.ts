import { DynamicModule, Global, Module } from '@nestjs/common';

import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtService } from './jwt.service';

@Module({})
// @Global()
export class JwtModule {
  /* Dynamic Module은 단지 또 다른 Module을 반환해주는 Module이다  */
  static forRoot(options: JwtModuleOptions): DynamicModule {
    const { privateKey, isGlobal } = options;
    return {
      module: JwtModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: privateKey,
        },
        JwtService,
      ],
      exports: [JwtService],
      global: isGlobal || false,
    }; /* Dynamic Module */
  } /* forRoot() 이름은 Convention */
}
