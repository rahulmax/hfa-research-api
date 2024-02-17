import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class SocialService {
  private LOGGER = new Logger(SocialService.name);
  maxDays: number = parseInt(process.env.maxDays);
  timeZone = 'Asia/kolkata';
  constructor(
    private httpservice: HttpServiceService,
    private cacheService: CacheService,
  ) {}
  @Cron(CronExpression.EVERY_WEEK)
  saveSocialMetricsData() {
    [
      'UCRvqjQPSeaWn-uEx-w0XOIg', //ben
      'digitalassetnewsdan',
      'altcoin_daily',
      'CoinBureau',
      'DataDash',
      'CryptoBanterGroup',
      'InvestAnswers',
      'CryptosRUs',
      'UC7B3Y1yrg4S7mmgoR-NsfxA', //taiki
      'DrakeonDigital',
      'Dynamodefi',
      'Thecalculatorguy',
      'kryptocove',
      'blocmates'
    ].forEach((val) => {
      this.httpservice
        .get(`https://matrix.sbapis.com/b/youtube/statistics`, {
          clientid: process.env.MATRIX_CLIENTID,
          token: process.env.MATRIX_TOKEN,
          query: val,
          history: 'archive',
          'allow-stale': true,
        })
        .subscribe({
          next: (res) => {
            if(res.data?.data?.daily){
              const data = this.mapForDates(res.data.data.daily, this.maxDays);
              this.cacheService.saveInCache(val, data);
            } else {
              const data = this.mapForDates([], this.maxDays);
              this.cacheService.saveInCache(val, data);
            }
          },
          error: (err) => {
            this.LOGGER.error(`Got Error Social ${val}`, err);
          },
        });
    });
  }

  mapForDates(
    data: Array<{ date: string; subs: number; views: number }>,
    days: number,
  ) {
    const startDate = DateTime.now()
      .setZone(this.timeZone)
      .minus({ days })
      .startOf('day');
    const resultData = new Array(days);

    // Pre-calculate timestamps for the entire range
    const timestamps = Array.from({ length: days + 1 }, (_, i) =>
      startDate.plus({ days: i }).toFormat('yyyy-MM-dd'),
    );
    // Create a Map for faster lookup
    const dailyDataMap: Map<string, any> = new Map(
      data.map((val) => [
        DateTime.fromFormat(val.date, 'yyyy-MM-dd')
          .setZone(this.timeZone)
          .startOf('day')
          .toFormat('yyyy-MM-dd'),
        {
          date: val.date,
          subs: val.subs,
          views: val.views,
        },
      ]),
    );
    for (let i = 0; i <= days; i++) {
      const currentTimestamp = timestamps[i];

      if (dailyDataMap.has(currentTimestamp)) {
        resultData[i] = dailyDataMap.get(currentTimestamp);
      } else {
        resultData[i] = {
          date: currentTimestamp,
          subs: 0,
          views: 0,
        };
      }
    }
    return resultData;
  }

  async getSocialById(id: string, days: number) {
    const data: any = await this.cacheService.get(id);
    if (data) {
      return data.reverse().slice(0, days).reverse();
    }
    return [];
  }
}
