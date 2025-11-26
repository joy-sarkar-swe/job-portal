import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../schemas/user.schema';
import { AppliedJobsPaginationDto } from './dto/applied-jobs.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@GetUser() user: any) {
    return this.userService.getProfile(user.userId);
  }

  @Patch('profile')
  @Roles(UserRole.JOBSEEKER)
  async updateProfile(
    @GetUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.userId, updateProfileDto);
  }

  @Get('applied-jobs')
  @Roles(UserRole.JOBSEEKER)
  async getAppliedJobs(
    @GetUser() user: any,
    @Query() query: AppliedJobsPaginationDto,
  ) {
    return this.userService.getAppliedJobs(user.userId, query);
  }
}
