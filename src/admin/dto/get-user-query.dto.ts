import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { UserRole } from 'src/schemas/user.schema';

export class GetUsersQueryDto {
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

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be one of: jobseeker, employer, admin',
  })
  role?: UserRole;

  @IsOptional()
  @Type(() => String)
  search?: string;
}
