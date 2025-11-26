import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  JOBSEEKER = 'jobseeker',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.JOBSEEKER })
  role: UserRole;

  @Prop({ required: false })
  bio?: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ required: false })
  resumeUrl?: string;

  @Prop({ default: false })
  isEmployerApproved: boolean;

  @Prop({ default: false })
  isBlocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
