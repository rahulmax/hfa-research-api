import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class EtheriumGasService {
  private readonly LOGGER = new Logger(EtheriumGasService.name);
  constructor(
    private readonly httpService: HttpServiceService,
    private readonly cacheServie: CacheService,
  ) {}

  @Cron(CronExpression.EVERY_3_HOURS)
  EthariumGasData() {
    this.httpService
      .get('https://api.blocknative.com/gasprices/by-date')
      .subscribe({
        next: (res) => {
          this.LOGGER.log('Saved Gasprices Data');
          this.cacheServie.saveInCache('gasprices', res.data);
        },
        error: (err) => {
          this.LOGGER.error('Error Getting Gasprices Data', err);
        },
      });
  }
  getEthariumGasData() {
    this.LOGGER.log('Getting Gasprices Data');
    return this.cacheServie.get("gasprices");
  }
}
