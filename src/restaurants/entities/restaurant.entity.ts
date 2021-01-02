import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @InputType() 스키마에 포함됨 -- Restaurant 이름으로 두개가 됨
@InputType({ isAbstract: true }) //스키마 등록 X, 그냥 extend
@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Field(type => String /*return type function */) // 가독성
  @Column()
  @IsString()
  name: string;

  @Field(type => Boolean, { nullable: true, defaultValue: true }) // GraphQL 스키마에서의 defaultValue
  @Column({ default: true }) // DB에서의 defaultValue
  @IsOptional() // Validation : 보내지 않으면 기본값으로 함
  @IsBoolean() // Validation
  isVegan: boolean;

  @Field(type => String)
  @Column()
  @IsString()
  address: string;

  @Field(type => String)
  @Column()
  @IsString()
  ownersName: string;

  @Field(type => String)
  @Column()
  @IsString()
  categoryName: string;
}
