import {
  IsString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { JobType } from '../../schemas/job.schema';

export class CreateJobDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Company must be a string' })
  @IsNotEmpty({ message: 'Company is required' })
  company: string;

  @IsString({ message: 'Location must be a string' })
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsEnum(JobType, {
    message: 'Job type must be one of: full-time, part-time, remote',
  })
  @IsNotEmpty({ message: 'Job type is required' })
  jobType: JobType;

  @IsString({ message: 'Salary range must be a string' })
  @IsNotEmpty({ message: 'Salary range is required' })
  salaryRange: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}
