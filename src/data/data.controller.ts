import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { DataService } from './data.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('coins')
@UseInterceptors(CacheInterceptor)
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('')
  findAll() {
    return this.dataService.getAllCoins();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataService.getCoinById(id);
  }
}
