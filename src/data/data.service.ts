import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class DataService {
  private readonly LOGGER = new Logger(DataService.name);
  constructor(private readonly cacheService: CacheService) {}

  async getAllCoins() {
    this.LOGGER.debug('Getting List of Coin Ids:');
    return await this.cacheService.get('coins');
  }

  async getCoinById(id: string, currency: string, days: number) {
    this.LOGGER.debug('Getting Data for the Id', `Id : ${id} Currency : ${currency} days : ${days}`);
    const data: any = await this.cacheService.get(`${id}_${currency}`);
    const res = {
      prices: data.prices.reverse().slice(0, days).reverse(),
      market_caps: data.market_caps.reverse().slice(0, days).reverse(),
      total_volumes: data.total_volumes.reverse().slice(0, days).reverse(),
    };
    return res;
  }
}
