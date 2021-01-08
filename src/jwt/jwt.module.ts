import { DynamicModule, Module } from '@nestjs/common';

import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({})
// @Global()
export class JwtModule {
  /* Dynamic Module은 단지 또 다른 Module을 반환해주는 Module이다  */
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
      global: options.isGlobal,
    }; /* Dynamic Module */
  } /* forRoot() 이름은 Convention */
}
