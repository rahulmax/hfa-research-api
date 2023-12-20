import { Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoController } from './coingecko.controller';
import { CacheService } from '../cache/cache.service'; // Adjust the path as needed
import { HttpServiceService } from 'src/http-service/http-service.service';

@Module({
  imports: [HttpModule],
  providers: [CoingeckoService, CacheService, HttpServiceService],
  controllers: [CoingeckoController],
})
export class CoingeckoModule {}
