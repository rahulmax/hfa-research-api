import { Controller, Get, Param, Post } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
    constructor(private readonly service: SocialService){}
    @Post()
    saveSocialMetricsData(){
        this.service.saveSocialMetricsData();
    }

    @Get(':id')
    getById(@Param('id') id: string){
        return this.service.getSocialById(id);
    }
}
