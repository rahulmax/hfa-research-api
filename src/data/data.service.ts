import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class DataService {
  private readonly LOGGER = new Logger(DataService.name);
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getAllCoins() {
    this.LOGGER.debug('Getting List of Coin Ids:');
    return await this.cacheManager.get('coins');
  }

  async getCoinById(id: string) {
    const data: any = await this.cacheManager.get(id);
    this.LOGGER.debug('Getting Data for the Id', id, data?.prices[0]);
    return data;
  }
}
