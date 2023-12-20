import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpServiceService } from './http-service.service';

@Module({
    imports: [HttpModule],
    providers: [HttpServiceService],
    controllers: [],
  })
export class HttpServiceModule {}
