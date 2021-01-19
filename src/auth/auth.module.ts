import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD, // guard를 앱 모든 곳에서 사용하고 싶다면
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
