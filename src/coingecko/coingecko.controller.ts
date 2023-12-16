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
  @Get('')
  getCoinGeckoData() {
    this.coinGeckoService.getCoinGeckoData();
    return 'coingecko';
  }
}
