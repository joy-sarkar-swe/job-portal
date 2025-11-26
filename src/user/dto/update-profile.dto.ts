import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString({ message: 'Bio must be a string' })
  @IsOptional()
  bio?: string;

  @IsArray({ message: 'Skills must be an array' })
  @IsString({ each: true, message: 'Each skill must be a string' })
  @IsOptional()
  skills?: string[];

  @IsString({ message: 'Resume URL must be a string' })
  @IsOptional()
  resumeUrl?: string;
}
