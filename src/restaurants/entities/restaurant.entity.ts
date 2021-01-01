import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field(type => String /*return type function */) // 가독성
  name: string;

  @Field(type => Boolean, { nullable: true })
  isGood?: boolean;
}
