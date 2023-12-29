import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class DefiService {
  private readonly LOGGER = new Logger(DefiService.name);
  constructor(
    private readonly httpService: HttpServiceService,
    private readonly cacheService: CacheService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  saveDefiCoinsData() {
    this.httpService
      .get('https://api.llama.fi/v2/historicalChainTvl')
      .subscribe({
        next: (res) => {
          this.LOGGER.log('Saved Defi Tvl Data');
          this.cacheService.saveInCache('defi_tvl', res.data);
        },
      });
  }
  getDefiCoinsData() {
    return this.cacheService.get('defi_tvl');
  }
}
