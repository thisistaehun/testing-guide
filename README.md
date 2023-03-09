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
│ ├── transactions
│ │ └── update-user.transaction.ts
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
import { UpdateUserTransaction } from './transactions/update-user.transaction';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly updateUserTransaction: UpdateUserTransaction
  ) {}
  create(createUserInput: CreateUserInput) {
    return this.usersRepository.save(
      this.usersRepository.create(createUserInput)
    );
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(code: string) {
    return this.usersRepository.findOne({
      where: {
        code,
      },
    });
  }

  async update(updateUserInput: UpdateUserInput) {
    return this.updateUserTransaction.run({ updateUserInput });
  }

  async remove(code: string) {
    return this.usersRepository.delete(code);
  }
}
```

## service 테스트 코드 작성

현재 UsersService는 다음과 같은 종속성을 가지고 있습니다.

- `@InjectRepository(User)` 를 통해 주입받은 `Repository<User>`
- `UpdateUserTransaction` 을 통해 주입받은 `UpdateUserTransaction`

따라서 테스트 코드를 작성할 때는 이 두 종속성을 모두 주입해주어야 합니다. 이때, 테스트 로직이 DB에 직접 접근하는 것은 데이터 손실의 위험이 있으므로, mock 객체를 다음과 같이 생성하여 mockRepository와 mockUpdateUserTransaction을 주입해주어야 합니다.

### users.service.spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserTransaction } from './transactions/update-user.transaction';
import { UsersService } from './users.service';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockUpdateUserTransaction = {
  run: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let updateUserTransaction: UpdateUserTransaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: UpdateUserTransaction, useValue: mockUpdateUserTransaction },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    updateUserTransaction = module.get<UpdateUserTransaction>(
      UpdateUserTransaction
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

위의 코드를 보면 `Test.createTestingModule()` 을 통해 테스트 모듈을 생성하고, `Test.createTestingModule().compile()` 을 통해 컴파일을 해주고 있습니다. 이렇게 생성된 테스트 모듈을 통해 테스트 코드를 작성할 수 있습니다.

## 테스트 코드 실행

테스트 코드를 작성했다면 다음과 같이 테스트 코드를 실행할 수 있습니다.

```bash
yarn test
```

## 테스트 코드 커버리지 확인

테스트 코드를 작성했다면 다음과 같이 테스트 코드 커버리지를 확인할 수 있습니다.

```bash
yarn test:cov
```

## 참고

- [NestJS 공식 문서 - Testing](https://docs.nestjs.com/fundamentals/testing)

```

```
