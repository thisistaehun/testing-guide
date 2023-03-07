import { Test, TestingModule } from '@nestjs/testing';
import { MyResolver } from './my.resolver';
import { MyService } from './my.service';

describe('MyResolver', () => {
  let resolver: MyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [MyResolver, MyService],
      exports: [MyService],
    }).compile();

    resolver = module.get<MyResolver>(MyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
