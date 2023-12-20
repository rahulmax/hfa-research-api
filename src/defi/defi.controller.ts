import { Controller, Get, Post } from '@nestjs/common';
import { DefiService } from './defi.service';

@Controller('defi')
export class DefiController {
    constructor(private readonly service: DefiService) {}

    @Post()
    saveDefiData(){
        return this.service.saveDefiCoinsData();
    }

    @Get()
    getDefiCoins(){
        return this.service.getDefiCoinsData();
    }
}
