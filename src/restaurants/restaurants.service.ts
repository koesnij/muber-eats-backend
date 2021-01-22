import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-reataurant.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';

import { User } from 'src/users/entities/user.entity';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import { Dish } from './entities/dish.entity';

const PAGE_SIZE = 25;

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    // @InjectRepository(Category)
    private readonly categories: CategoryRepository,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
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
        return { ok: false, error: '존재하지 않는 레스토랑입니다.' };
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

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurantId) {
        return { ok: false, error: '존재하지 않는 레스토랑입니다.' };
      }
      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: '이 레스토랑을 삭제할 권한이 없습니다.',
        };
      }

      await this.restaurants.delete(restaurantId);
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: '레스토랑을 삭제할 수 없습니다.',
      };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [results, totalResults] = await this.restaurants.findAndCount({
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      });
      return {
        ok: true,
        results,
        totalResults,
        totalPages: Math.ceil(totalResults / PAGE_SIZE),
      };
    } catch {
      return {
        ok: false,
        error: '레스토랑을 조회할 수 없습니다.',
      };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId, {
        relations: ['menu'],
      });
      if (!restaurant) {
        throw new Error();
      }
      return {
        ok: true,
        restaurant,
      };
    } catch {
      return {
        ok: false,
        error: '해당 레스토랑을 찾을 수 없습니다.',
      };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: { name: Raw(name => `${name} ILIKE '%${query}%'`) },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      });
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / PAGE_SIZE),
      };
    } catch {
      return { ok: false, error: '검색에 실패했습니다.' };
    }
  }

  /** Categories CRUD */
  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return { ok: true, categories };
    } catch {
      return {
        ok: false,
        error: '카테고리를 불러올 수 없습니다.',
      };
    }
  }

  countRestaurants(category: Category): Promise<number> {
    return this.restaurants.count({ category });
  }

  async findCategoryBySlug({
    page,
    slug,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return {
          ok: false,
          error: '존재하지 않는 카테고리입니다.',
        };
      }
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: { category },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });

      category.restaurants = restaurants;
      return {
        ok: true,
        category,
        totalResults,
        totalPages: Math.ceil(totalResults / PAGE_SIZE),
      };
    } catch {
      return {
        ok: false,
      };
    }
  }

  /* Dishes CRUD */
  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOne(
        createDishInput.restaurantId,
      );
      if (!restaurant) {
        return { ok: false, error: '존재하지 않는 레스토랑입니다.' };
      }
      if (restaurant.ownerId !== owner.id) {
        return { ok: false, error: '이 레스토랑을 수정할 권한이 없습니다.' };
      }

      const dish = await this.dishes.save(
        this.dishes.create({ ...createDishInput, restaurant }),
      );

      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Dish를 생성할 수 없습니다.' };
    }
  }
}
