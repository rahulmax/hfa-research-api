import { Test, TestingModule } from '@nestjs/testing';
import { EtheriumGasService } from './etherium_gas.service';

describe('EtheriumGasService', () => {
  let service: EtheriumGasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtheriumGasService],
    }).compile();

    service = module.get<EtheriumGasService>(EtheriumGasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
