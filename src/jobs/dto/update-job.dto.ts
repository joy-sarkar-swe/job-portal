import { IsString, IsOptional, IsEnum } from 'class-validator';
import { JobType } from '../../schemas/job.schema';

export class UpdateJobDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Company must be a string' })
  @IsOptional()
  company?: string;

  @IsString({ message: 'Location must be a string' })
  @IsOptional()
  location?: string;

  @IsEnum(JobType, {
    message: 'Job type must be one of: full-time, part-time, remote',
  })
  @IsOptional()
  jobType?: JobType;

  @IsString({ message: 'Salary range must be a string' })
  @IsOptional()
  salaryRange?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;
}
