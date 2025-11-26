import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetJobsQueryDto } from 'src/jobs/dto/jobs-query.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';
import { AdminService } from './admin.service';
import { GetUsersQueryDto } from './dto/get-user-query.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers(@Query() query: GetUsersQueryDto) {
    return this.adminService.getAllUsers(query);
  }

  @Patch('user/block/:userId')
  async toggleBlockUser(@Param('userId') userId: string) {
    return this.adminService.toggleBlockUser(userId);
  }

  @Get('employers/pending')
  async getPendingEmployers() {
    return this.adminService.getPendingEmployers();
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
  async getAllApplications() {
    return this.adminService.getAllApplications();
  }
}
