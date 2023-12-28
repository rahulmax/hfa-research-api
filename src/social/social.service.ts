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
          clientid: 'cli_a71f8ef72d127c603a528c88',
          token:
            '0c2596b7d252a445351653e52d63eb135ea2d60c06b274ad112f3c90684a9ea72860ae2885d257e9a35cf236fcc80aae0b4fb9c4d7c15ce12fa20cf349934327',
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
