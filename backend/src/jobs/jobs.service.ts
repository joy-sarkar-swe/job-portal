import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Application,
  ApplicationDocument,
} from '../schemas/application.schema';
import { Job, JobDocument } from '../schemas/job.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsQueryDto } from './dto/jobs-query.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createJob(userId: string, createJobDto: CreateJobDto) {
    const job = new this.jobModel({
      ...createJobDto,
      employer: userId,
    });

    await job.save();

    return {
      statusCode: 201,
      message: 'Job created successfully',
      job,
    };
  }

  async updateJob(userId: string, jobId: string, updateJobDto: UpdateJobDto) {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user is the owner of the job
    if (job.employer.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own jobs');
    }

    Object.assign(job, updateJobDto);
    await job.save();

    return {
      statusCode: 200,
      message: 'Job updated successfully',
      job,
    };
  }

  async getAllJobs(query: GetJobsQueryDto) {
    const { location, jobType, cursor } = query;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;

    const filter: any = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (cursor) {
      filter._id = { $lt: cursor };
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { company: { $regex: query.search, $options: 'i' } },
        { location: { $regex: query.search, $options: 'i' } },
        { skills: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Fetch jobs
    const jobs = await this.jobModel
      .find(filter)
      .populate('employer', 'name email')
      .sort({ _id: -1 })
      .limit(limit);

    // Get job IDs
    const jobIds = jobs.map((job) => job._id);

    // Aggregate total applicants per job
    type ApplicantsAgg = { _id: Types.ObjectId; count: number };
    const applicants = await this.applicationModel.aggregate<ApplicantsAgg>([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } },
    ]);

    // Convert to a lookup map
    const applicantsMap = new Map<string, number>();
    applicants.forEach((a) => applicantsMap.set(a._id.toString(), a.count));

    // Attach applicantsCount to each job
    const jobsWithApplicants = jobs.map((job) => ({
      ...job.toObject(),
      applicantsCount: applicantsMap.get(job._id.toString()) || 0,
    }));

    const nextCursor = jobsWithApplicants.length
      ? jobsWithApplicants[jobsWithApplicants.length - 1]._id
      : null;

    return {
      statusCode: 200,
      message: 'Jobs retrieved successfully',
      nextCursor,
      hasMore: !!nextCursor,
      jobs: jobsWithApplicants,
    };
  }

  async getJobById(jobId: string) {
    const job = await this.jobModel
      .findById(jobId)
      .populate('employer', 'name email company');

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      message: 'Job retrieved successfully',
      statusCode: 200,
      job,
    };
  }

  async getJobApplicants(userId: string, jobId: string) {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if user is the owner of the job
    if (job.employer.toString() !== userId) {
      throw new ForbiddenException(
        'You can only view applicants for your own jobs',
      );
    }

    const applications = await this.applicationModel
      .find({ job: jobId })
      .populate('jobseeker', 'name email skills resumeUrl')
      .sort({ appliedAt: -1 });

    return {
      statusCode: 200,
      message: 'Applicants retrieved successfully',
      applicants: applications.map((app) => {
        const jobseeker = app.jobseeker as any;
        return {
          applicationId: app._id,
          appliedAt: app.appliedAt,
          applicant: {
            name: jobseeker.name,
            email: jobseeker.email,
            skills: jobseeker.skills,
            resume: jobseeker.resumeUrl,
          },
        };
      }),
    };
  }
}
