import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(returns => [Restaurant] /* graphql type */)
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation(returns => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> /* return promise */ {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  @Mutation(returns => Boolean)
  async updateRestaurant(
    @Args(/*인풋타입을 쓸때 argument 이름필요 */) data: UpdateRestaurantDto,
  ) {
    return true;
  }
}
