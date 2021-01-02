import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}
  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }
  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    // const newRestaurant = new Restaurant();
    // newRestaurant.name = createRestaurantDto.name;
    const newRestaurant = this.restaurants.create(createRestaurantDto); // 실제 DB는 안건듬(instance) & createRestaurantDto는 검증되었기때문에 바로 이렇게 사용 가능
    return this.restaurants.save(newRestaurant); // Promise
  }
}
