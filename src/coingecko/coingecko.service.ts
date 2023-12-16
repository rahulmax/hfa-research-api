import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CoingeckoService {
  private readonly LOGGER = new Logger(CoingeckoService.name);
  private readonly COINS_LIST = [
    'bitcoin',
    'ethereum',
    'tether',
    'binancecoin',
    'ripple',
    'solana',
    'usd-coin',
    'cardano',
    'staked-ether',
    'avalanche-2',
    'dogecoin',
    'polkadot',
    'tron',
    'chainlink',
    'matic-network',
    'wrapped-bitcoin',
    'shiba-inu',
    'litecoin',
    'dai',
    'internet-computer',
    'uniswap',
    'bitcoin-cash',
    'stellar',
    'okb',
    'leo-token',
    'cosmos',
    'monero',
    'ethereum-classic',
    'filecoin',
    'immutable-x',
    'hedera-hashgraph',
    'crypto-com-chain',
    'injective-protocol',
    'kaspa',
    'aptos',
    'true-usd',
    'near',
    'vechain',
    'optimism',
    'celestia',
    'bittensor',
    'lido-dao',
    'mantle',
    'render-token',
    'thorchain',
    'first-digital-usd',
    'quant-network',
    'elrond-erd-2',
    'algorand',
    'aave',
    'the-graph',
    'arbitrum',
    'blockstack',
    'bonk',
    'havven',
    'rocket-pool-eth',
    'maker',
    'bittorrent',
    'binance-usd',
    'wemix-token',
    'fantom',
    'flow',
    'helium',
    'theta-token',
    'beam-2',
    'the-sandbox',
    'ordinals',
    'kucoin-shares',
    'osmosis',
    'terra-luna',
    'bitcoin-cash-sv',
    'axie-infinity',
    'decentraland',
    'neo',
    'gala',
    'iota',
    'eos',
    'klay-token',
    'tezos',
    'dydx',
    'kava',
    'whitebit',
    'mina-protocol',
    'bitget-token',
    'gatechain-token',
    'arweave',
    'usdd',
    'woo-network',
    'tokenize-xchange',
    'cheelee',
    'xdce-crowd-sale',
    'fetch-ai',
    'conflux-token',
    'frax-ether',
    'frax-share',
    'sui',
    'ecash',
    'frax',
    'apecoin',
    'chiliz',
  ];

  constructor(private readonly httpService: HttpService) {}
  // TODO: Uncomment the function before Release
  // @Cron('0 0 * * *') // Specify the function to run Every day at 00:00 hours
  /**
   * @description Used to Get Coin Gecko Data Based on the Coins Array.
   */
  getCoinGeckoData() {
    this.COINS_LIST.forEach((coin, index) => {
      setTimeout(() => {
        this.fetchDataForCoin(coin);
      }, index * 12000); // Delay each request by 12 seconds to ensure rate limiting
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
          this.LOGGER.debug(
            `Response received for ${coin}:`,
            res.data.prices[0],
          );
        },
        error: (err) => {
          this.LOGGER.error(`Error fetching data for ${coin}:`, err);
        },
      });
  }
}
