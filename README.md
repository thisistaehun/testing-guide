## 왜 테스트 코드인가?

테스트 코드의 구현은 많은 시간이 소요되는 작업이지만 결과적으로는 코드 퀄리티를 높이고 디버깅 시간을 압도적으로 줄일 수 있기 때문에 총 개발 시간을 단축시킬 수 있습니다. 또한 리펙토링이 용이해지기 때문에 기획이 변경되거나 새로운 기능을 추가할 때에도 훨씬 수월하게 진행할 수 있습니다. 실제로 대부분의 기업에서 테스트 프로세스는 선택이 아니라 필수로 받아들여지고 있습니다. 따라서 테스트 코드를 도입한다면 더 높은 생산성과 서비스 품질을 기대할 수 있을 것 같습니다.

## 기대 효과

테스트 코드를 구현하여 얻을 수 있는 기대 효과는 다음과 같습니다.

- 단위 기능 개발 시 **에러를 사전에 방지**하여 개발 속도 향상
- **테스트에 적합한 코드를 구현**하는 과정에서 **역할 분담 및 관심사 분리**를 고려한 더 좋은 코드 생산 가능
- 철저한 모듈화가 필수적으로 이루어져야 하기 때문에 **코드의 재사용성**을 높일 수 있음
- 기존 코드와 병합 후 발생하는 **예기치 못한 오류를 사전에 검출** 가능
- 전체적인 **기능 테스트에 들이는 시간을 크게 단축** 가능
- 개발 추가/변경 상황에서 **리펙토링 용이**
- 진정한 의미의 **지속적인 통합(CI, Continuous Integration)** 실현 가능
- **나와 동료의 코드에 확신과 믿음을 가질 수 있음**

## Test의 5가지 원칙(F, I, R, S, T)

### F(Fast 빠르게)

각 테스트는 통합 테스트가 수행됨에 있어 시간적 부담을 느끼지 않을 수준으로 빠르게 수행될 수 있어야 합니다.

### I(Independent 독립적으로)

각 테스트는 서로 간의 영향을 주고받지 않도록 독립적으로 수행되어야 합니다. 단, 서비스 로직 상의 불가피한 예외적인 상황에 한해 테스트 순서를 고정시켜 수행하는 것을 허용합니다.

### R(Repeatable 반복 가능하게)

테스트는 수정이 발생하지 않는 한 매번 같은 결과를 내보내야만 합니다.

### S(Self-Validating 자가 검증하는)

각 테스트의 결과는 주관적이 되어서는 안되며, 성공 또는 실패여야만 합니다.

### T(Timely 적시에)

단위 테스트는 테스트 하려는 **실제 코드를 구현하기 직전에 구현**해야 합니다.

## 설치 및 실행

### 패키지 설치

nestJS에서는 일반적으로 Jest라는 테스트 러너 및 모킹 라이브러리를 사용합니다. 테스트를 시작하려면 다음 명령어로 @nestjs/testing 라이브러리를 설치해야 합니다. (설치가 되어있다면 생략해도 됩니다.)

```bash
$ npm i --save-dev @nestjs/testing
```

### 테스트 파일 생성

nest-cli의 `nest g resource my` 라는 명령어를 이용하여 모듈을 생성한다고 가정하면 자동으로 다음과 같은 구조의 폴더와 파일이 생성됩니다. (GraphQL: Code first 기준)

```markdown
## 폴더 구조

my - dto/ - entities/ - my.module.ts - my.resolver.ts - my.resolver.spec.ts - my.service.ts - my.service.spec.ts
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
