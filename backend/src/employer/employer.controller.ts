import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { Roles } from 'common/decorators/roles.decorator';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';
import { EmployerService } from './employer.service';

@Controller('employer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get('status')
  @Roles(UserRole.EMPLOYER)
  async getStatus(@GetUser() user: any) {
    return this.employerService.getStatus(user.userId);
  }
}
