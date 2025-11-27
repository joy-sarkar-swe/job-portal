import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema()
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  job: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  jobseeker: Types.ObjectId;

  @Prop({ default: false })
  approved: boolean;

  @Prop({ default: Date.now })
  appliedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

// Create compound index to prevent duplicate applications
ApplicationSchema.index({ job: 1, jobseeker: 1 }, { unique: true });
