import { Module } from '@nestjs/common';
import { GovernanceService } from './governance.service';
import { GovernanceController } from './governance.controller';
import { GraphqlService } from 'src/graphql/graphql.service';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    GovernanceService,
    GraphqlService,
    CacheService,
    HttpServiceService,
  ],
  controllers: [GovernanceController],
})
export class GovernanceModule {}
