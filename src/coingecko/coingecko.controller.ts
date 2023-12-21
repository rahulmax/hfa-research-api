import { Controller, Get, Logger, Post } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';

@Controller('coingecko')
export class CoingeckoController {
  private readonly LOGGER = new Logger(CoingeckoController.name);

  constructor(private readonly coinGeckoService: CoingeckoService) {}
  /**
   *
   * @returns Used to refresh the Data based on the User
   */
  @Post('usd')
  getCoinGeckoDataUSD() {
    return this.coinGeckoService.getCoinGeckoData();
  }
  @Post('eth')
  getCoinGeckoDataETH() {
    return this.coinGeckoService.getCoinGeckoDataEth();
  }
}
