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
  <br>
- email
- password
- role (client | owner | delivery)

### User CRUD:

- [x] Create Account
- [x] Log In
- [x] See Profile
- [x] Edit Profile
- [x] Verify Email

### User Testing:

- Unit Testing
- E2E Testing

---

### Restaurant Entity:

- id
- createdAt
- updatedAt
  <br>
- name
- category
- address
- coverImage

### Restaurant CRUD:

- [x] Create Restaurant
- [x] Edit Restaurant
- [x] Delete Restaurant
- [ ] See Restaurants (pagination)
- [ ] See Restaurant (detail)

- [x] See Categories
- [ ] See Restaurants by Category (pagination)

- [ ] Create Dish
- [ ] Edit Dish
- [ ] Delete Dish
