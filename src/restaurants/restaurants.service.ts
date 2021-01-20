import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    // @InjectRepository(Category)
    private readonly categories: CategoryRepository,
  ) {}
  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);

      newRestaurant.owner = owner;
      newRestaurant.category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );
      await this.restaurants.save(newRestaurant);
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: '레스토랑을 생성할 수 없습니다.',
      };
    }
  }

  async editRestaurant(
    owner: User,
    {
      restaurantId,
      name,
      address,
      coverImg,
      categoryName,
    }: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: '존재하지 않는 레스토랑입니다.',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: '이 레스토랑을 수정할 권한이 없습니다.',
        };
      }

      /** 데이터베이스에 변경사항 반영 */
      if (name) restaurant.name = name;
      if (address) restaurant.address = address;
      if (coverImg) restaurant.coverImg = coverImg;
      if (categoryName)
        restaurant.category = await this.categories.getOrCreate(categoryName);
      await this.restaurants.save(restaurant);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Unexpected Error' };
    }
  }
}
