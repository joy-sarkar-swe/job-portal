import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Job } from './job.schema';
import { User } from './user.schema';

export type ApplicationDocument = Application & Document;

@Schema()
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  job: Types.ObjectId | Job;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  jobseeker: Types.ObjectId | User;

  @Prop({ default: Date.now })
  appliedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

// Create compound index to prevent duplicate applications
ApplicationSchema.index({ job: 1, jobseeker: 1 }, { unique: true });
