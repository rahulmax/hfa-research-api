import { Module } from '@nestjs/common';
import { EtheriumGasService } from './etherium_gas.service';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';
import { HttpModule } from '@nestjs/axios';
import { EtheriumGasController } from './etherium_gas.controller';

@Module({
  imports: [HttpModule],
  providers: [EtheriumGasService, CacheService, HttpServiceService],
  controllers: [EtheriumGasController]
})
export class EtheriumGasModule {}
