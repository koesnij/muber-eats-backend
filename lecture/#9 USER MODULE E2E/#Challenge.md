# Challenge - editProfile에서 이메일 중복 체크하기

## E2E 테스팅

- 이번에는 실제 코드 말고 테스트 코드를 먼저 작성해본다.

test/users.e2e-spec.ts

```ts
it('should fail if email is duplicated', () => {
  return privateTest(`
      mutation {
        editProfile(input: {
          email: "${NEW_EMAIL}"
        }) {
          ok
          error
        }
      }
    `)
    .expect(200)
    .expect(res => {
      const {
        body: {
          data: { editProfile },
        },
      } = res;
      expect(editProfile.ok).toBe(false);
      expect(editProfile.error).toBe('이미 사용 중인 이메일입니다.');
    });
});
```

- 앞의 테스트에서 한 User의 이메일을 `NEW_EMAIL`로 변경하였다. 다시 `NEW_EMAIL`로 변경을 시도하면 중복 검사에 걸릴 것이다.
- 중복일 때, 응답 메시지로 `ok`는 `false`, `error`는 `'이미 사용 중인 이메일입니다.'`를 리턴하도록 한다.

## 중복 검사 로직 작성

- User Entity의 `email` 컬럼에 `unique: true` 옵션을 추가한다.
- Users Service에서 코드로 중복 검사 후, 에러 메시지를 반환한다.

src/users/users.service.ts

```ts
async editProfile(
  userId: number,
  { email, password }: EditProfileInput,
): Promise<EditProfileOutput> {
  try {
    const user = await this.users.findOne(userId);
    if (email) {
  >>  const exists = await this.users.findOne({ email }); <<
      if (exists) {
        return {
          ok: false,
          error: '이미 사용 중인 이메일입니다.',
        };
      }
    ...
```

- `findOne({ email })`을 통해 DB에 해당 `email`의 User가 존재하는지 검사한다.

## UNIT TESTING

- 코드가 추가된 만큼 `coverage`가 감소했을 것이다.
- 이메일 중복 시의 테스트 항목을 추가한다.

### 같은 mock function이 다른 결과를 반환하게 하려면?

- (중복 X인 경우) `findOne`이 처음에는 User 객체를 반환하고, 두 번째에서는 `null`을 반환해야 한다.
- (중복 O인 경우) `findOne`이 계속 User 객체를 반환해야 한다.

#### 다음과 같이 mocking할 수 있다

```ts
    // 중복 X
    it('should change email', async () => {
      ...
      usersRepository.findOne
        .mockResolvedValueOnce(oldUser) // find user
        .mockResolvedValue(null); // find user failed
```

- `mockResolvedValueOnce()`를 사용하여 순차적으로 mocking할 수 있다.

### 같은 mock function이 다른 인자를 받는 걸 expect하려면?

- `toHaveBeenNthCalledWith()`

```ts
expect(usersRepository.findOne).toHaveBeenNthCalledWith(
  1,
  editProfileArgs.userId,
);
expect(usersRepository.findOne).toHaveBeenNthCalledWith(
  2,
  editProfileArgs.input,
);
```
