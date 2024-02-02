import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheService } from 'src/cache/cache.service';
import { GraphqlService } from 'src/graphql/graphql.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class GovernanceService {
  private LOGGER = new Logger(GovernanceService.name);
  constructor(
    private readonly graphQlService: GraphqlService,
    private readonly cacheService: CacheService,
    private readonly httpService: HttpServiceService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  saveGovernanceData() {
    this.saveMakerData();
    [
      'opcollective.eth',
      'lido-snapshot.eth',
      'aave.eth',
      'curve.eth',
      'arbitrumfoundation.eth',
      'frax.eth',
      'uniswap',
    ].forEach((val) => {
      this.graphQlService
        .query(
          `{
            proposals(
                first: 30
                skip: 0
                where: { space_in: ["${val}"] }
                orderDirection: desc
            ) {
                title
                body
                start
                end
                state
                scores_total
                scores_updated
                space {
                    id
                    name
                }
            }
        }`,
        )
        .then((res) => {
          this.cacheService.saveInCache(val, res);
        })
        .catch((err) => {
          this.LOGGER.debug('GOT Err: ', err);
        });
    });
  }

  saveMakerData() {
    this.httpService.get('https://vote.makerdao.com/api/executive').subscribe({
      next: (res) => {
        this.cacheService.saveInCache('maker.eth', res.data);
      },
      error: (err) => {
        this.LOGGER.debug('GOT Err: ', err);
      },
    });
  }
  getById(id: string) {
    return this.cacheService.get(id);
  }
}
