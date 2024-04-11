import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';

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
    'jupiter-perpetuals-liquidity-provider-token',
  ];
  maxDays: number = parseInt(process.env.maxDays);
  apiDelay: number = parseInt(process.env.API_DELAY);
  timeZone = 'Asia/kolkata';

  constructor(
    private readonly httpService: HttpServiceService,
    private readonly cacheService: CacheService,
  ) {}
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
        x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
        vs_currency: currency,
        days: this.maxDays,
      })
      .subscribe({
        next: (res) => {
          const data = res.data;
          const prices = this.getTime(data.prices, this.maxDays);
          const marketCap = this.getTime(data.market_caps, this.maxDays);
          const totalVol = this.getTime(data.total_volumes, this.maxDays);
          this.saveInCache(`${coin}_${currency}`, {
            prices: prices,
            market_caps: marketCap,
            total_volumes: totalVol,
          });
          this.LOGGER.debug(`Response Cached for Coingecko ${coin}`);
        },
        error: (err) => {
          this.LOGGER.error(`Error fetching data for ${coin}:`, err);
          this.handelErrorCoin(coin, currency);
        },
      });
  }
  async handelErrorCoin(coin: string, currency: string) {
    const data: any = await this.cacheService.get(`${coin}_${currency}`);
    if (data) {
      this.LOGGER.debug(
        `Updated Today data to 0 since got Error on API ${coin} ${currency}`,
      );
      const prices = this.getTime(data.prices, this.maxDays);
      const marketCap = this.getTime(data.market_caps, this.maxDays);
      const totalVol = this.getTime(data.total_volumes, this.maxDays);
      this.saveInCache(`${coin}_${currency}`, {
        prices: prices,
        market_caps: marketCap,
        total_volumes: totalVol,
      });
    }
  }
  async saveInCache(coin: string, data: any) {
    await this.cacheService.saveInCache(coin, data);
  }
  getTime(dailyData: Array<Array<number>>, days: number) {
    const startDate = DateTime.now()
      .setZone(this.timeZone)
      .minus({ days })
      .startOf('day');
    const resultData = new Array(days);

    // Pre-calculate timestamps for the entire range
    const timestamps = Array.from({ length: days + 1 }, (_, i) =>
      startDate.plus({ days: i }).toMillis(),
    );
    // Create a Map for faster lookup
    const dailyDataMap = new Map(
      dailyData.map(([timestamp, value]) => [
        DateTime.fromMillis(timestamp)
          .setZone(this.timeZone)
          .startOf('day')
          .toMillis(),
        [timestamp, value],
      ]),
    );

    for (let i = 0; i <= days; i++) {
      const currentTimestamp = timestamps[i];

      if (dailyDataMap.has(currentTimestamp)) {
        resultData[i] = dailyDataMap.get(currentTimestamp);
      } else {
        resultData[i] = [currentTimestamp, 0];
      }
    }

    return resultData;
  }
}
