import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class DataService {
  private readonly LOGGER = new Logger(DataService.name);
  constructor(private readonly cacheService: CacheService) {}

  async getAllCoins(currency: string) {
    return await this.cacheService.get(`top100_coins_${currency}`);
  }

  async getCoinById(id: string, currency: string, days: number) {
    const data: any = await this.cacheService.get(`${id}_${currency}`);
    if (data) {
      return {
        prices: data.prices.reverse().slice(0, days).reverse(),
        market_caps: data.market_caps.reverse().slice(0, days).reverse(),
        total_volumes: data.total_volumes.reverse().slice(0, days).reverse(),
      };
    }
    return {
      prices: [],
      market_caps: [],
      total_volumes: [],
    };
  }
}
