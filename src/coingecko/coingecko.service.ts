import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class CoingeckoService {
  private readonly LOGGER = new Logger(CoingeckoService.name);
  // Essential Coins Based on the Requirement
  private COINS_LIST = [
    'uniswap',
    'lido-dao',
    'maker',
    'aave',
    'compound-governance-token',
    'havven',
    'frax-share',
    'chainlink',
    'dydx',
    'gmx',
    'solana',
    'avalanche-2',
    'polkadot',
    'cardano',
    'cosmos',
    'hedera-hashgraph',
    'near',
    'injective-protocol',
    'optimism',
    'arbitrum',
    'matic-network',
    'mantle',
    'tether',
    'usd-coin',
    'dai',
    'true-usd',
    'binance-usd',
    'first-digital-usd',
    'usdd',
    'frax',
    'tether-gold',
    'paxos-standard',
    'liquity-usd',
    'paypal-usd',
    'prisma-mkusd',
    'canto',
    'centrifuge',
    'goldfinch',
    'maple',
  ];
  maxDays: number = parseInt(process.env.maxDays);
  apiDelay: number = parseInt(process.env.API_DELAY);

  constructor(
    private readonly httpService: HttpServiceService,
    private readonly cacheService: CacheService,
  ) {}
  // TODO: Uncomment the function before Release
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  /**
   * @description Used to Get Coin Gecko Data Based on the Coins Array.
   */
  getCoinGeckoData() {
    this.LOGGER.debug('CRON STARTED USD');
    return this.getTop100Coins();
  }
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  /**
   * @description Used to Get Coin Gecko Data Based on the Coins Array.
   */
  getCoinGeckoDataEth() {
    this.LOGGER.debug('CRON STARTED ETH');
    return this.getTop100Coins('eth');
  }
  getTop100Coins(
    currency: string = 'usd',
    per_page: number = 100,
    page: number = 1,
    order: string = 'market_cap_desc',
    sparkline: boolean = false,
    locale: string = 'en',
  ) {
    this.httpService
      .get(`https://api.coingecko.com/api/v3/coins/markets`, {
        vs_currency: currency,
        order: order,
        per_page: per_page,
        page: page,
        sparkline: sparkline,
        locale: locale,
      })
      .subscribe({
        next: (res) => {
          const map = new Set<string>();
          this.COINS_LIST.forEach((val) => map.add(val));
          res.data.forEach((val: any) => {
            map.add(val.id);
          });
          let top100Coins = res.data.map((val: any) => val.id);
          this.COINS_LIST = Array.from(map.values());
          this.saveInCache(`top100_coins_${currency}`, top100Coins);
          this.fetchDataWithDelay(0, this.COINS_LIST, currency, this.apiDelay);
          this.LOGGER.debug(`Response Cached for Coingecko ${this.COINS_LIST}`);
          return 'fetching data';
        },
        error: (err) => {
          this.LOGGER.error(`Error fetching data for Top 100`, err);
          return 'Error fetching data';
        },
      });
  }
  async fetchDataWithDelay(
    index: number,
    coinsList: Array<string>,
    currency: string,
    apiDelay: number,
  ) {
    if (index < coinsList.length) {
      const coin = coinsList[index];
      this.LOGGER.debug(
        `Response Cached for Coingecko ${coin}:${this.apiDelay}`,
      );
      await this.fetchDataForCoin(coin, currency);

      // Wait for the specified delay before making the next API call
      await new Promise((resolve) => setTimeout(resolve, apiDelay));

      // Make the next API call
      await this.fetchDataWithDelay(index + 1, coinsList, currency, apiDelay);
    }
  }
  fetchDataForCoin(coin: string, currency: string) {
    this.httpService
      .get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart`, {
        vs_currency: currency,
        days: this.maxDays,
      })
      .subscribe({
        next: (res) => {
          this.saveInCache(`${coin}_${currency}`, res.data);
        },
        error: (err) => {
          this.LOGGER.error(`Error fetching data for ${coin}:`, err);
        },
      });
  }
  async saveInCache(coin: string, data: any) {
    await this.cacheService.saveInCache(coin, data);
  }
}
