import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { IsString, Length } from 'class-validator';

import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Dish } from './dish.entity';

// @InputType() 스키마에 포함됨 -- Restaurant 이름으로 두개가 됨
@InputType('RestaurantInputType', { isAbstract: true }) //스키마 등록 X, 그냥 extend
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(type => String /*return type function */) // 가독성
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field(type => String)
  @Column()
  @IsString()
  address: string;

  @Field(type => Category, { nullable: true }) // 카테고리가 삭제되어도 레스토랑은 삭제되면 안됨.
  @ManyToOne(type => Category, category => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field(type => User)
  @ManyToOne(type => User, user => user.restaurants, { onDelete: 'CASCADE' })
  owner: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field(type => [Dish])
  @OneToMany(type => Dish, dish => dish.restaurant)
  menu: Dish[];
}
