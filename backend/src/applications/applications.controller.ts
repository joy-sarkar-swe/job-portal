import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { Roles } from 'common/decorators/roles.decorator';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';
import { ApplicationsService } from './applications.service';
import { MyApplicationsQueryDto } from './dto/my-applications-query.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(':jobId')
  @Roles(UserRole.JOBSEEKER)
  async applyForJob(@GetUser() user: any, @Param('jobId') jobId: string) {
    return this.applicationsService.applyForJob(user.userId, jobId);
  }

  @Get('my')
  @Roles(UserRole.JOBSEEKER)
  async getMyApplications(
    @GetUser() user: any,
    @Query() query: MyApplicationsQueryDto,
  ) {
    return this.applicationsService.getMyApplications(user.userId, query);
  }
}
