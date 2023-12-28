import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { HttpServiceService } from 'src/http-service/http-service.service';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [HttpModule],
  providers: [SocialService, HttpServiceService, CacheService],
  controllers: [SocialController],
})
export class SocialModule {}
