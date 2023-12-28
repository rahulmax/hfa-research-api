import { Controller, Get, Post } from '@nestjs/common';
import { PoolsService } from './pools.service';

@Controller('pools')
export class PoolsController {
  constructor(private readonly service: PoolsService) {}

  @Post()
  savePoolsData() {
    this.service.savePoolsData();
  }
  @Get()
  getPools() {
    return this.service.getPoolsData();
  }
}
