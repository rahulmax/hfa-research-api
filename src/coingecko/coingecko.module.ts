import { Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoController } from './coingecko.controller';

@Module({
  imports: [HttpModule],
  providers: [CoingeckoService],
  controllers: [CoingeckoController],
})
export class CoingeckoModule {}
