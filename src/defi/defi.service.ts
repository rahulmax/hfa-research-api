import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class DefiService {
  private readonly LOGGER = new Logger(DefiService.name);
  constructor(
    private readonly httpService: HttpServiceService,
    private readonly cacheService: CacheService,
  ) {}

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
    this.LOGGER.log('Getting Defi Tvl Data');
    return this.cacheService.get('defi_tvl');
  }
}
