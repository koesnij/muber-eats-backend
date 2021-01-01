import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 앱 어디에서든지 접근 가능
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'koesnij',
      password: '-', // local에서 접속할 때는 비밀번호를 묻지 않음
      database: 'muber-eats',
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true, // on memory
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
