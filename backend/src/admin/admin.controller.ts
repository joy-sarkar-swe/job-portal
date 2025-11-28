import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'common/decorators/roles.decorator';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { GetJobsQueryDto } from 'src/jobs/dto/jobs-query.dto';
import { UserRole } from '../schemas/user.schema';
import { AdminService } from './admin.service';
import { GetAllApplicationQueryDto } from './dto/get-application-query.dto';
import { GetUsersQueryDto } from './dto/get-user-query.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  async getOverview() {
    return this.adminService.getOverview();
  }

  @Get('users')
  async getAllUsers(@Query() query: GetUsersQueryDto) {
    console.log(query.status);

    return this.adminService.getAllUsers(query);
  }

  @Patch('user/block/:userId')
  async toggleBlockUser(@Param('userId') userId: string) {
    return this.adminService.toggleBlockUser(userId);
  }

  @Get('employers/pending')
  async getPendingEmployers(@Query() query: GetUsersQueryDto) {
    return this.adminService.getPendingEmployers(query);
  }

  @Patch('employers/approve/:id')
  async approveEmployer(@Param('id') id: string) {
    return this.adminService.approveEmployer(id);
  }

  @Get('jobs')
  async getAllJobs(@Query() query: GetJobsQueryDto) {
    return this.adminService.getAllJobs(query);
  }

  @Get('applications')
  async getAllApplications(@Query() query: GetAllApplicationQueryDto) {
    return this.adminService.getAllApplications(query);
  }
}
