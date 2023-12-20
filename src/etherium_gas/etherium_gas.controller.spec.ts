import { Test, TestingModule } from '@nestjs/testing';
import { EtheriumGasController } from './etherium_gas.controller';

describe('EtheriumGasController', () => {
  let controller: EtheriumGasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtheriumGasController],
    }).compile();

    controller = module.get<EtheriumGasController>(EtheriumGasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
