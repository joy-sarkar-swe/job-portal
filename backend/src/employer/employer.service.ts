import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Application,
  ApplicationDocument,
} from '../schemas/application.schema';
import { Job, JobDocument } from '../schemas/job.schema';
import { User, UserDocument, UserRole } from '../schemas/user.schema';

@Injectable()
export class EmployerService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async getOverview(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.EMPLOYER) {
      throw new NotFoundException('Only employers can access this resource');
    }

    // Get all jobs posted by this employer
    const employerJobs = await this.jobModel.find({ employer: userId });
    const jobIds = employerJobs.map((job) => job._id);

    const [totalJobsPosted, totalApplicants, notApprovedApplications] =
      await Promise.all([
        this.jobModel.countDocuments({ employer: userId }),
        this.applicationModel.countDocuments({ job: { $in: jobIds } }),
        this.applicationModel.countDocuments({
          job: { $in: jobIds },
          approved: false,
        }),
      ]);

    return {
      statusCode: 200,
      message: 'Employer overview retrieved successfully',
      overview: {
        totalJobsPosted,
        totalApplicants,
        notApprovedApplications,
      },
    };
  }

  async getStatus(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.EMPLOYER) {
      throw new NotFoundException('Only employers can check their status');
    }

    return {
      statusCode: 200,
      approvalStatus: user.isEmployerApproved ? true : false,
      message: user.isEmployerApproved
        ? 'Your employer account is approved'
        : 'Your employer account is pending approval',
    };
  }
}
