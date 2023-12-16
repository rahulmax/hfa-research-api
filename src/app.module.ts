import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoingeckoModule } from './coingecko/coingecko.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CoingeckoModule, ScheduleModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
