import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class AppliedJobsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1)
  limit?: number = 10;
}
