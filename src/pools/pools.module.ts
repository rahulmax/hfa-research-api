import { Module } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { PoolsController } from './pools.controller';
import { HttpServiceService } from 'src/http-service/http-service.service';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [HttpModule],
  providers: [PoolsService, HttpServiceService, CacheService],
  controllers: [PoolsController],
})
export class PoolsModule {}
