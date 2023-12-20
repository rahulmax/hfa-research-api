import { Module } from '@nestjs/common';
import { DefiController } from './defi.controller';
import { DefiService } from './defi.service';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [DefiController],
  providers: [DefiService, CacheService, HttpServiceService]
})
export class DefiModule {}
