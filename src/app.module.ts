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
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule } from '@nestjs/config';
import { EtheriumGasModule } from './etherium_gas/etherium_gas.module';
import { HttpServiceService } from './http-service/http-service.service';
import { HttpServiceModule } from './http-service/http-service.module';
import { DefiModule } from './defi/defi.module';
import { YoutubeModule } from './youtube/youtube.module';
import { GraphqlModule } from './graphql/graphql.module';
import { GovernanceModule } from './governance/governance.module';
import { SocialModule } from './social/social.module';
import { PoolsModule } from './pools/pools.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    HttpModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
          },
          password: process.env.RADIUS_PASSWORD,
        }),
        ttl: 24 * 60 * 60,
      }),
    }),
    DataModule,
    CoingeckoModule,
    EtheriumGasModule,
    HttpServiceModule,
    DefiModule,
    YoutubeModule,
    GraphqlModule,
    GovernanceModule,
    SocialModule,
    PoolsModule,
  ],
  controllers: [AppController, DataController],
  providers: [AppService, DataService, CacheService, HttpServiceService],
})
export class AppModule {}
