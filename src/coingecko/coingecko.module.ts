import { Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoController } from './coingecko.controller';
import { CacheService } from '../cache/cache.service'; // Adjust the path as needed

@Module({
  imports: [HttpModule],
  providers: [CoingeckoService, CacheService],
  controllers: [CoingeckoController],
})
export class CoingeckoModule {}
