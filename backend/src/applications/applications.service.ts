import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Application,
  ApplicationDocument,
} from '../schemas/application.schema';
import { Job, JobDocument } from '../schemas/job.schema';
import { MyApplicationsQueryDto } from './dto/my-applications-query.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
  ) {}

  async applyForJob(userId: string, jobId: string) {
    // Check if job exists
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user has already applied
    const existingApplication = await this.applicationModel.findOne({
      job: jobId,
      jobseeker: userId,
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied for this job');
    }

    // Create new application
    const application = new this.applicationModel({
      job: jobId,
      jobseeker: userId,
    });

    await application.save();

    return {
      statusCode: 201,
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        jobId: application.job,
        appliedAt: application.appliedAt,
      },
    };
  }

  async getMyApplications(userId: string, query: MyApplicationsQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      this.applicationModel
        .find({ jobseeker: userId })
        .populate({
          path: 'job',
          populate: {
            path: 'employer',
            select: 'name email',
          },
        })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit),
      this.applicationModel.countDocuments({ jobseeker: userId }),
    ]);

    return {
      statusCode: 200,
      message: 'Applications retrieved successfully',
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: applications.map((app) => ({
        applicationId: app._id,
        appliedAt: app.appliedAt,
        approved: app.approved,
        job: app.job,
      })),
    };
  }
}
