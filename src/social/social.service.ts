import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class SocialService {
  private LOGGER = new Logger(SocialService.name);

  constructor(
    private httpservice: HttpServiceService,
    private cacheService: CacheService,
  ) {}

  saveSocialMetricsData() {
    [
      'UCRvqjQPSeaWn-uEx-w0XOIg',
      'digitalassetnewsdan',
      'altcoin_daily',
      'CoinBureau',
      'DataDash',
      'CryptoBanterGroup',
      'InvestAnswers',
      'CryptosRUs',
      'UCPC2iE2Yuj20m5Dimn-vVBg',
      'thenifty',
      'UCOaX0Vu-dWB7bNjFMnbBo2A',
      'TheParallaxHQ',
      'CryptoGorilla',
      'UC7B3Y1yrg4S7mmgoR-NsfxA',
      'DrakeonDigital',
      'Dynamodefi',
      'Thecalculatorguy',
      'ThorHartvigsen',
      'CeazorsSnackSandwich',
    ].forEach((val) => {
      this.httpservice
        .get(`https://matrix.sbapis.com/b/youtube/statistics`, {
          clientid: process.env.MATRIX_CLIENTID,
          token:
            process.env.MATRIX_TOKEN,
          query: val,
          history: 'archive',
        })
        .subscribe({
          next: (res) => {
            this.cacheService.saveInCache(val, res.data);
          },
          error: (err) => {
            this.LOGGER.error('Got Error Social', err);
          },
        });
    });
  }

  getSocialById(id: string) {
    return this.cacheService.get(id);
  }
}
