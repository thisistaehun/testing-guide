# NestJS 테스트 코드 작성하기

## 목차

- [NestJS 테스트 코드 작성하기](#nestjs-테스트-코드-작성하기)

  - [목차](#목차)
  - [설치 및 실행](#설치-및-실행)
    - [패키지 설치](#패키지-설치)
    - [테스트 파일 생성](#테스트-파일-생성)
  - [테스트 전 Config 설정](#테스트-전-config-설정)
  - [테스트 코드 작성](#테스트-코드-작성)
    - [테스트 모듈 생성](#테스트-모듈-생성)
    - [테스트 코드 작성](#테스트-코드-작성-1)
    - [테스트 실행](#테스트-실행)
  - [참고자료](#참고자료)

  <br/>
  <br/>

## 설치 및 실행

### 패키지 설치

nestJS에서는 일반적으로 Jest라는 테스트 러너 및 모킹 라이브러리를 사용합니다. 테스트를 시작하려면 다음 명령어로 @nestjs/testing 라이브러리를 설치해야 합니다. (설치가 되어있다면 생략해도 됩니다.)

```bash
npm i --save-dev @nestjs/testing
```

### 테스트 파일 생성

nest-cli의 `nest g resource my` 라는 명령어를 이용하여 모듈을 생성한다고 가정하면 자동으로 다음과 같은 구조의 폴더와 파일이 생성됩니다. (GraphQL: Code first 기준)

```markdown
폴더 구조

src
├── users
│ ├── dtos
│ │ └── create-user.dto.ts
│ │ └── update-user.dto.ts
│ ├── entities
│ │ └── user.entity.ts
│ ├── users.module.ts
│ ├── users.resolver.ts
│ ├── users.resolver.spec.ts  
│ ├── users.service.ts
│ └── users.service.spec.ts
```

Jest는 기본적으로 뒤에 `.spec.ts` 로 끝나는 파일을 자동으로 테스트 파일로 인식하고 동작시킵니다. 이제 `my.resolver.ts` 와 `my.service.ts` 의 테스트 코드는 `my.resolver.spec.ts` 와 `my.service.spec.ts` 에 작성하게 됩니다.

모든 유닛 테스트를 한 번에 실행시키려면 `jest` 를, 특정 파일만 실행시키려면 `jest my.service` 와 같은 형식으로 CLI Command를 입력하면 됩니다. `jest --coverage` 는 테스트 커버리지를 보여주고, `jest --watch` 는 테스트를 watch 모드로 실행시켜줍니다. nestJS에서는 기본적으로 package.json에 다음과 같이 script들이 세팅되어 있어 이를 활용하면 패키지 매니저를 통해 쉽게 test 관련 명령어를 실행시킬 수 있습니다.

```json
//package.json
"scripts": {
...
 "test": "jest",
     "test:watch": "jest --watch",
     "test:cov": "jest --coverage",
     "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
     "test:e2e": "jest --config ./test/jest-e2e.json",
...
},
...
```

## 테스트 전 Config 설정

ts-jest의 경우 기본적으로 tsconfig.json 파일을 참조하여 테스트를 실행시킵니다. 하지만 rootDir이나 outDir 등의 설정이 있을 경우 ts-jest가 정상적으로 동작하지 않을 수 있습니다. 예를 들어,
절대 경로를 사용하여 모듈을 import하는 경우에는 tsconfig.json의 baseUrl과 paths 설정을 반드시 추가해주어야 합니다. 따라서 tsconfig.json 파일을 다음과 같이 수정해주어야 합니다.

```json
//tsconfig.json
...
  "compilerOptions": {
 "baseUrl": "./",
 "paths": {
   "@src/*": ["src/*"]
 },
 ...
  },
...
```

또한 ts-jest의 설정 파일을 따로 만들어주거나 package.json에 다음과 같이 설정을 추가해주면 됩니다.

```typescript
//jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/$1',
  },
};
```

```json
//package.json
...
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^@src/(.*)$": "<rootDir>/$1"
    }
  }
...
```

다음과 같이 설정했다면 절대 경로로 import 해오는 모든 모듈의 path를 `@src/~` 로 설정해주어야 합니다. 이렇게 설정해주면 ts-jest가 정상적으로 동작하게 됩니다.
`@src` 는 `src` 로 대체되며, `@src/common/common.entity.ts` 는 `src/common/common.entity.ts` 로 대체됩니다.

```typescript
import { CommonEntity } from '@src/common/common.entity';
```

## 테스트 코드 작성

기본적으로 NestJS의 테스트 코드는 실제 NestJS 런타임과 동일한 환경으로 구성하여야 합니다. 특정 모듈에 주입된 종속성을 모두 주입해주어야만 정상적으로 테스트가 수행됩니다. 이를 위해 `Test.createTestingModule()` 을 사용하여 테스트 모듈을 생성하고, `Test.createTestingModule().compile()` 을 통해 컴파일을 해주어야 합니다. 이렇게 생성된 테스트 모듈을 통해 테스트 코드를 작성할 수 있습니다.

유저 모듈과 서비스의 코드가 다음과 같다고 가정하겠습니다.

### users.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserTransaction } from './transactions/update-user.transaction';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService, UpdateUserTransaction],
  exports: [UsersService],
})
export class UsersModule {}
```

### users.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { DeleteUserTransaction } from './transactions/delete-user.transaction';
import { UpdateUserTransaction } from './transactions/update-user.transaction';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly updateUserTransaction: UpdateUserTransaction,
    private readonly deleteUserTransaction: DeleteUserTransaction
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create(createUserInput)
    );
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(code: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        code,
      },
    });
  }

  async update(updateUserInput: UpdateUserInput): Promise<User> {
    return this.updateUserTransaction.run({ updateUserInput });
  }

  async remove(code: string): Promise<User> {
    return this.deleteUserTransaction.run({ code });
  }
}
```

현재 UsersService는 다음과 같은 종속성을 가지고 있습니다.

- `@InjectRepository(User)` 를 통해 주입받은 `Repository<User>`
- `UpdateUserTransaction` 을 통해 주입받은 `UpdateUserTransaction`
- `DeleteUserTransaction` 을 통해 주입받은 `DeleteUserTransaction`

따라서 테스트 코드를 작성할 때는 이 **세 가지 종속성을 모두 주입**해주어야 합니다. 이때, 테스트 로직이 DB에 직접 접근하는 것은 **데이터 손실의 위험**이 있으므로, DB에 접근하는 대신 mockUsers라는 배열에 유저 정보를 저장하도록 하겠습니다. mockUsers라는 배열에 접근하기 위해 실제 DB 접근 시 사용하는 Repository를 대체하는 **Mock Repository와 Mock Transaction**을 만들어서 주입해주겠습니다.

### src/users/repositories/mock-users.ts

```typescript
import { User } from '../entities/user.entity';

export const mockUsers: User[] = [];
```

다음은 Mock User Repository를 살펴보겠습니다.

### **src/users/repositories/mock-user.repository.ts**

```typescript
import { CreateUserInput } from '../../dto/create-user.input';
import { User } from '../../entities/user.entity';
import { mockUsers } from './mock-users';

export class MockUserRepository {
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user: User = new User({
      name: createUserInput.name,
      age: createUserInput.age,
    });
    return user;
  }

  async save(user: User): Promise<User> {
    const newUser: User = await Promise.resolve(user);
    mockUsers.push(newUser);
    return newUser;
  }

  async find(): Promise<User[]> {
    return mockUsers;
  }

  async findOne({ where: { code } }): Promise<User> {
    for (const user of mockUsers) {
      if (user.code === code) {
        return user;
      }
    }
  }
}
```

마지막으로, UpdateUserTransaction과 DeleteUserTransaction을 대체하는 MockUpdateUserTransaction과 MockDeleteUserTransaction을 살펴보겠습니다.

### src/users/transactions/mock-update-user.transaction.ts

```typescript
import { User } from '@src/modules/users/entities/user.entity';
import { mockUsers } from '../mock-users';

export class MockDeleteUserTransaction {
  async run({ code }: { code: string }) {
    const user: User = mockUsers.find((user) => user.code === code);
    for (let i = 0; i < mockUsers.length; i++) {
      if (mockUsers[i].code === code) {
        mockUsers.splice(i, 1);
      }
    }
    return user;
  }
}
```

### src/users/transactions/mock-delete-user.transaction.ts

```typescript
import { User } from '@src/modules/users/entities/user.entity';
import { mockUsers } from '../mock-users';

export class MockDeleteUserTransaction {
  async run({ code }: { code: string }) {
    const user: User = mockUsers.find((user) => user.code === code);
    for (let i = 0; i < mockUsers.length; i++) {
      if (mockUsers[i].code === code) {
        mockUsers.splice(i, 1);
      }
    }
    return user;
  }
}
```

이제 Mock Repository와 Mock Transaction을 모두 만들었으니, 이를 주입하여 users.service.spec.ts 코드를 작성해보겠습니다. 테스트 코드를 작성할 때는 다음과 같은 순서로 진행합니다.

### **1단계: 종속성 주입**

1. `@nestjs/testing` 모듈을 통해 테스트 모듈을 만듭니다.
2. `getRepositoryToken`을 통해 실제 Repository를 대체할 Mock Repository를 주입합니다.
3. `UpdateUserTransaction`과 `DeleteUserTransaction`을 대체할 Mock Transaction을 주입합니다.
4. `UsersService`를 주입받아 테스트를 진행합니다.

### **2단계: Method 단위 테스트 작성**

이 단계에서 유의할 점은 모든 테스트가 독립적으로 실행되어야 한다는 것입니다. 따라서 **각 테스트가 실행되기 전과 실행된 후에 mockUsers 배열을 초기화**해주어야 합니다.

1. beforeEach()를 통해 각 테스트가 실행되기 전에 mockUsers 배열을 초기화합니다.
2. 각 메서드별 테스트를 테스트 정의에 맞게 작성합니다.

- `create` 메서드는 유저를 생성하고, mockUsers 배열에 유저 정보를 저장합니다.
- `update` 메서드는 유저 정보를 업데이트하고, mockUsers 배열에 업데이트된 유저 정보를 저장합니다.
- `remove` 메서드는 유저를 삭제하고, mockUsers 배열에서 해당 유저 정보를 삭제합니다.
- `findAll` 메서드는 mockUsers 배열에 저장된 유저 정보를 반환합니다.
- `findOne` 메서드는 mockUsers 배열에 저장된 유저 정보를 code를 통해 조회하여 반환합니다.

3. 각 테스트가 끝난 후에 mockUsers 배열을 초기화합니다.

### src/users/users.service.spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';
import { DeleteUserTransaction } from '../transactions/delete-user.transaction';
import { UpdateUserTransaction } from '../transactions/update-user.transaction';
import { UsersService } from '../users.service';
import { mockUsers } from './mocks/mock-users';
import { MockUserRepository } from './mocks/mock-users.repository';
import { MockDeleteUserTransaction } from './mocks/transactions/mock-delete-user.transaction';
import { MockUpdateUserTransaction } from './mocks/transactions/mock-update-user.transaction';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: MockUserRepository },
        { provide: UpdateUserTransaction, useClass: MockUpdateUserTransaction },
        { provide: DeleteUserTransaction, useClass: MockDeleteUserTransaction },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserInput: CreateUserInput = {
        name: 'test',
        age: 20,
      };
      const result = await service.create(createUserInput);
      expect(result.name).toEqual(createUserInput.name);
      expect(result.age).toEqual(createUserInput.age);
    });

    afterAll(() => {
      mockUsers.pop();
      expect(mockUsers.length).toEqual(0);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = mockUsers;
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    let code: string;
    beforeEach(async () => {
      const newUser: User = await service.create({
        name: 'test',
        age: 20,
      });
      code = newUser.code;
    });

    it('should return a user', async () => {
      const result: User = await service.findOne(code);

      expect(result.code).toEqual(code);
    });

    afterAll(() => {
      mockUsers.pop();
      expect(mockUsers.length).toEqual(0);
    });
  });

  describe('update', () => {
    let code: string;
    beforeEach(async () => {
      const newUser: User = await service.create({
        name: 'test',
        age: 20,
      });
      code = newUser.code;
    });

    it('should update a user', async () => {
      const updateUserInput: UpdateUserInput = {
        code,
        name: 'test2',
        age: 30,
      };
      const result = await service.update(updateUserInput);
      expect(result.name).toEqual(updateUserInput.name);
      expect(result.age).toEqual(updateUserInput.age);
    });

    afterAll(() => {
      mockUsers.pop();
      expect(mockUsers.length).toEqual(0);
    });
  });

  describe('remove', () => {
    let code: string;
    beforeEach(async () => {
      const newUser: User = await service.create({
        name: 'test',
        age: 20,
      });
      code = newUser.code;
    });

    it('should remove a user', async () => {
      await service.remove(code);
      expect(mockUsers.length).toEqual(0);
    });
  });
});
```

## 테스트 코드 실행

테스트 코드를 작성했다면 테스트 코드를 실행시켜볼 차례입니다. 테스트 코드는 기본적으로 `yarn test` 명령어를 통해 실행할 수 있는데, 테스트 코드를 모듈별로 실행하고 싶다면 `yarn test [모듈명]` 명령어를 통해 실행할 수 있습니다. 예를 들어, `*.service.spec.ts` 파일을 테스트하고 싶다면 다음과 같이 실행하면 됩니다.

```bash
yarn test service
```

테스트가 무사히 통과되었다면 다음과 같은 결과를 확인할 수 있습니다.

```bash
 PASS  src/modules/users/tests/users.service.spec.ts (5.984 s)
  UsersService
    √ should be defined (12 ms)
    create
      √ should create a user (4 ms)
    findAll
      √ should return an array of users (3 ms)
    findOne
      √ should return a user (3 ms)
    update
      √ should update a user (4 ms)
    remove
      √ should remove a user (2 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        6.134 s
Ran all test suites matching /service/i.
Done in 7.20s.

```

## 테스트 코드 커버리지 확인

테스트 코드를 작성했다면 테스트 코드 커버리지를 확인할 수 있습니다. 테스트 코드 커버리지는 테스트 코드가 얼마나 작성되었는지를 확인할 수 있습니다.
각 %는 다음과 같은 의미를 가집니다.

- % Stmts : 테스트 코드가 작성된 소스 코드의 비율
- % Branch : 테스트 코드가 작성된 분기문의 비율
- % Funcs : 테스트 코드가 작성된 함수의 비율
- % Lines : 테스트 코드가 작성된 라인의 비율

테스트 코드 커버리지를 확인하려면 다음 명령어를 실행하면 됩니다.

```bash
yarn test:cov
```

### **테스트 결과**

| File                                         | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s            |
| -------------------------------------------- | --------- | ---------- | --------- | --------- | ---------------------------- |
| All files                                    | 52.56     | 14.28      | 38.18     | 52.08     |
| src                                          | 0         | 0          | 0         | 0         |
| app.module.ts                                | 0         | 100        | 100       | 0         | 1-25                         |
| graphql.module.ts                            | 0         | 0          | 0         | 0         | 1-30                         |
| main.ts                                      | 0         | 100        | 0         | 0         | 2-15                         |
| src/common                                   | 0         | 100        | 0         | 0         |
| base.config.ts                               | 0         | 100        | 0         | 0         | 1-3                          |
| data-source.ts                               | 0         | 100        | 100       | 0         | 1-4                          |
| options.ts                                   | 0         | 100        | 100       | 0         | 2-11                         |
| orm.config.ts                                | 0         | 100        | 100       | 0         | 1-11                         |
| src/common/dto                               | 0         | 100        | 100       | 0         |
| core.output.ts                               | 0         | 100        | 100       | 0         | 1-4                          |
| src/common/entities                          | 65.21     | 0          | 14.28     | 76.47     |
| common.entity.ts                             | 65.21     | 0          | 14.28     | 76.47     | 52-53,59-60                  |
| src/common/transactions                      | 27.77     | 0          | 0         | 18.75     |
| base-transactions.ts                         | 27.77     | 0          | 0         | 18.75     | 6-38                         |
| src/common/utils                             | 100       | 100        | 100       | 100       |
| uuid-transformer.ts                          | 100       | 100        | 100       | 100       |
| src/modules/users                            | 57.14     | 100        | 36.36     | 62.22     |
| users.module.ts                              | 0         | 100        | 100       | 0         | 1-19                         |
| users.resolver.ts                            | 51.72     | 100        | 12.5      | 59.09     | 14-18,23,27-28,34-38,42-43   |
| users.service.ts                             | 100       | 100        | 100       | 100       |
| src/modules/users/dto                        | 91.66     | 100        | 0         | 100       |
| create-user.input.ts                         | 100       | 100        | 100       | 100       |
| update-user.input.ts                         | 85.71     | 100        | 0         | 100       |
| src/modules/users/entities                   | 100       | 100        | 100       | 100       |
| user.entity.ts                               | 100       | 100        | 100       | 100       |
| src/modules/users/tests/mocks                | 100       | 100        | 100       | 100       |
| mock-users.repository.ts                     | 100       | 100        | 100       | 100       |
| mock-users.ts                                | 100       | 100        | 100       | 100       |
| src/modules/users/tests/mocks/transactions   | 100       | 100        | 100       | 100       |
| mock-delete-user.transaction.ts              | 100       | 100        | 100       | 100       |
| mock-update-user.transaction.ts              | 100       | 100        | 100       | 100       |
| src/modules/users/transactions               | 66.66     | 100        | 0         | 58.82     |
| delete-user.transaction.ts                   | 63.63     | 100        | 0         | 55.55     | 12-25                        |
| update-user.transaction.ts                   | 70        | 100        | 0         | 62.5      | 13-21                        |
| -------------------------------------------- | --------- | ---------- | --------- | --------- | ---------------------------- |

Test Suites: 2 passed, 2 total
Tests: 7 passed, 7 total
Snapshots: 0 total
Time: 20.4 s
Ran all test suites.
Done in 21.36s.

## 참고

- [NestJS 공식 문서 - Testing](https://docs.nestjs.com/fundamentals/testing)
