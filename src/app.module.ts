import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    RestaurantsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true, // on memory
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
