import { Controller, Get, Param, Query } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('coins')
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
