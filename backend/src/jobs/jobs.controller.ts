import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { Roles } from 'common/decorators/roles.decorator';
import { EmployerApprovalGuard } from 'common/guards/employer-approval.guard';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsQueryDto } from './dto/jobs-query.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, EmployerApprovalGuard)
  @Roles(UserRole.EMPLOYER)
  async createJob(@GetUser() user: any, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.createJob(user.userId, createJobDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, EmployerApprovalGuard)
  @Roles(UserRole.EMPLOYER)
  async updateJob(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.updateJob(user.userId, id, updateJobDto);
  }

  @Get()
  async getAllJobs(@Query() query: GetJobsQueryDto) {
    return this.jobsService.getAllJobs(query);
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Get(':id/applicants')
  @UseGuards(JwtAuthGuard, RolesGuard, EmployerApprovalGuard)
  @Roles(UserRole.EMPLOYER)
  async getJobApplicants(@GetUser() user: any, @Param('id') id: string) {
    return this.jobsService.getJobApplicants(user.userId, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, EmployerApprovalGuard)
  @Roles(UserRole.EMPLOYER)
  async deleteJob(@GetUser() user: any, @Param('id') id: string) {
    return this.jobsService.deleteJob(user.userId, id);
  }
}
