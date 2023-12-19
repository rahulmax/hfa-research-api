import { Controller, Get, Param } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('coins')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  findAll() {
    return this.dataService.getAllCoins();
  }

  @Get(':currency/:id/:days')
  findOne(
    @Param('id') id: string,
    @Param('currency') currency: string,
    @Param('days') days: number,
  ) {
    return this.dataService.getCoinById(id, currency, days);
  }
}
