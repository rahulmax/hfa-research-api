import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class PoolsService {
  private readonly LOGGER = new Logger(PoolsService.name);
  constructor(
    private readonly _httpService: HttpServiceService,
    private readonly _cacheService: CacheService,
  ) {}
  pools = [
    'c8a24fee-ec00-4f38-86c0-9f6daebc4225',
    '747c1d2a-c668-4682-b9f9-296708a3dd90',
  ];
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  savePoolsData() {
    this._httpService.get('https://yields.llama.fi/pools').subscribe({
      next: (res) => {
        this.LOGGER.debug('Saved Pools Data');
        const data = res.data.data.filter((val: any) =>
          this.pools.includes(val.pool),
        );
        this._cacheService.saveInCache('pools', data);
      },
      error: (err) => {
        this.LOGGER.error('Error in Saving Pools Data');
      },
    });
  }

  getPoolsData() {
    return this._cacheService.get('pools');
  }
}
