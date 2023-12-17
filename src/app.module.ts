import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoingeckoModule } from './coingecko/coingecko.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { DataService } from './data/data.service';
import { DataController } from './data/data.controller';
import { DataModule } from './data/data.module';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [
    CoingeckoModule,
    ScheduleModule.forRoot(),
    HttpModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 24 * 60 * 60,
    }),
    DataModule,
  ],
  controllers: [AppController, DataController],
  providers: [AppService, DataService, CacheService],
})
export class AppModule {}
