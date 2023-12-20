import { Controller, Get, Logger } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';

@Controller('coingecko')
export class CoingeckoController {
  private readonly LOGGER = new Logger(CoingeckoController.name);

  constructor(private readonly coinGeckoService: CoingeckoService) {}
  /**
   *
   * @returns Used to refresh the Data based on the User
   */
  @Get('usd')
  getCoinGeckoDataUSD() {
    return this.coinGeckoService.getCoinGeckoData();
  }
  @Get('eth')
  getCoinGeckoDataETH() {
    this.coinGeckoService.getCoinGeckoDataEth();
    return 'coingeckoETH';
  }
}
