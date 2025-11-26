import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { JobType } from '../../schemas/job.schema';

export class GetJobsQueryDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(JobType, {
    message: 'jobType must be one of: full-time, part-time, remote',
  })
  @IsOptional()
  jobType?: JobType;

  @IsString()
  @IsOptional()
  cursor?: string;

  @IsNumberString({}, { message: 'limit must be a number' })
  @IsOptional()
  limit?: string;
}
