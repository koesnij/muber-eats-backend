import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString, Length } from 'class-validator';

import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from './category.entity';

// @InputType() 스키마에 포함됨 -- Restaurant 이름으로 두개가 됨
@InputType({ isAbstract: true }) //스키마 등록 X, 그냥 extend
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

  @ManyToOne(type => Category, category => category.restaurants)
  @Field(type => Category)
  category: Category;
}
