import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}
  // TODO: Uncomment the function before Release
  // @Cron('0 0 * * *') // Specify the function to run Every day at 00:00 hours
  /**
   * @description Used to Get Coin Gecko Data Based on the Coins Array.
   */
  getCoinGeckoData() {
    this.getTop100Coins();
  }
  getTop100Coins(
    per_page: number = 100,
    page: number = 1,
    order: string = 'market_cap_desc',
    currency: string = 'usd',
    sparkline: boolean = false,
    locale: string = 'en',
  ) {
    this.httpService
      .get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: currency,
          order: order,
          per_page: per_page,
          page: page,
          sparkline: sparkline,
          locale: locale,
        },
      })
      .subscribe({
        next: (res) => {
          const map = new Set<string>();
          this.COINS_LIST.forEach((val) => map.add(val));
          res.data.forEach((val) => {
            map.add(val.id);
          });
          this.LOGGER.debug(
            Array.from(map.values()).length,
            Array.from(map.values()),
          );
          this.COINS_LIST = Array.from(map.values());
          this.saveInCache('coins', this.COINS_LIST);
          this.COINS_LIST.forEach((coin, index) => {
            setTimeout(() => {
              this.fetchDataForCoin(coin);
            }, index * 14000); // Delay each request by 14 seconds to ensure rate limiting
          });
        },
        error: (err) => {
          this.LOGGER.error(`Error fetching data for Top 100`, err);
        },
      });
  }
  fetchDataForCoin(coin: string) {
    this.httpService
      .get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: 10,
        },
      })
      .subscribe({
        next: (res) => {
          this.saveInCache(coin, res.data);
        },
        error: (err) => {
          this.LOGGER.error(`Error fetching data for ${coin}:`, err);
        },
      });
  }
  async saveInCache(coin, data) {
    const prev = await this.cacheManager.get(coin);
    if (prev) {
      this.LOGGER.debug(`Removing Cache for ${coin}:`);
      this.cacheManager.del(coin);
    }
    this.LOGGER.debug(`Response Cached for ${coin}:`);
    await this.cacheManager.set(coin, data);
  }
}
