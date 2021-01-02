import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-restaurant.dto';
//업데이트는 id가 필요
@InputType()
export class UpdateRestaurantInputType extends PartialType(
  CreateRestaurantDto,
) {}

@ArgsType()
export class UpdateRestaurantDto {
  @Field(type => Number)
  id: number;
  @Field(type => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
