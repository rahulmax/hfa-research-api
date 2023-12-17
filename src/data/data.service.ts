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

  async getCoinById(id: string) {
    const data: any = await this.cacheService.get(id);
    this.LOGGER.debug('Getting Data for the Id', id, data?.prices[0]);
    return data;
  }
}
