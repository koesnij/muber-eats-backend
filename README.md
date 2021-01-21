# Muber Eats Backend

The Backend of Uber Eats Clone

## Tech Stack

- NestJS
  <br>https://docs.nestjs.com/
- GraphQL
  <br>https://graphql-kr.github.io/learn/
  <br>https://docs.nestjs.com/graphql/quick-start
- TypeORM
  <br>https://typeorm.io/#/
- PostgreSQL
  <br>https://www.postgresql.org/docs/

## Structure

### User Entity:

- id
- createdAt
- updatedAt
- email
- password
- role (client | owner | delivery)

### User CRUD:

- [x] Create Account
- [x] Log In
- [x] Me
- [x] See Profile
- [x] Edit Profile
- [x] Verify Email

### User Testing:

Unit Testing

- [x] Users Service (100/100)

E2E Testing

- [x] Create Account
- [x] Log In
- [x] Me
- [x] See Profile
- [x] Edit Profile
- [x] Verify Email

---

### Restaurant Entity:

- id
- createdAt
- updatedAt
- name
- category
- address
- coverImage

### Restaurant CRUD:

Restaurant

- [x] Create Restaurant
- [x] Edit Restaurant
- [x] Delete Restaurant
- [ ] See Restaurants (pagination)
- [ ] See Restaurant (detail)

Category

- [x] See Categories
- [x] See Restaurants by Category (pagination)

Dish

- [ ] Create Dish
- [ ] Edit Dish
- [ ] Delete Dish
