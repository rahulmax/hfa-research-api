import { Controller, Get, Param, Post } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(private readonly service: SocialService) {}
  @Post()
  saveSocialMetricsData() {
    this.service.saveSocialMetricsData();
  }

  @Get(':id/:days')
  getById(@Param('id') id: string, @Param('days') days: number) {
    return this.service.getSocialById(id, days);
  }
}
