import { Controller, Get, Param, Post } from '@nestjs/common';
import { GovernanceService } from './governance.service';

@Controller('governance')
export class GovernanceController {
  constructor(private readonly service: GovernanceService) {}
  @Post()
  saveGowernanceData() {
    this.service.saveGovernanceData();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
