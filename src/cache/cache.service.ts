import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly LOGGER = new Logger(CacheService.name);
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async saveInCache(coin, data) {
    await this.cacheManager.set(coin, data);
  }

  async delete(key) {
    await this.cacheManager.del(key);
  }

  async get(key) {
    return await this.cacheManager.get(key);
  }
}
