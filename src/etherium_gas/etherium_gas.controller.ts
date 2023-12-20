import { Controller, Get, Logger, Post } from '@nestjs/common';
import { EtheriumGasService } from './etherium_gas.service';

@Controller('etherium-gas')
export class EtheriumGasController {
  constructor(private readonly service: EtheriumGasService) {}
  @Post()
  EthGasPrices() {
    return this.service.EthariumGasData();
  }
  @Get()
  getEthGasPrices() {
    return this.service.getEthariumGasData();
  }
}
