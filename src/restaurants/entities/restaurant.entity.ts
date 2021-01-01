import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field(type => String /*return type function */) // 가독성
  name: string;

  @Field(type => Boolean)
  isVegan: boolean;

  @Field(type => String)
  address: string;

  @Field(type => String)
  ownerName: string;
}
