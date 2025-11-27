import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetJobsQueryDto } from 'src/jobs/dto/jobs-query.dto';
import {
  Application,
  ApplicationDocument,
} from '../schemas/application.schema';
import { Job, JobDocument } from '../schemas/job.schema';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { GetUsersQueryDto } from './dto/get-user-query.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async getOverview() {
    const [
      pendingEmployersCount,
      totalJobsCount,
      blockedUsersCount,
      totalApplicationsCount,
    ] = await Promise.all([
      this.userModel.countDocuments({
        role: UserRole.EMPLOYER,
        isEmployerApproved: false,
      }),
      this.jobModel.countDocuments(),
      this.userModel.countDocuments({ isBlocked: true }),
      this.applicationModel.countDocuments(),
    ]);

    return {
      statusCode: 200,
      message: 'Admin overview retrieved successfully',
      overview: {
        pendingEmployersCount,
        totalJobsCount,
        blockedUsersCount,
        totalApplicationsCount,
      },
    };
  }

  async getPendingEmployers(query: GetUsersQueryDto) {
    const { page = 1, limit = 10, search = '' } = query;

    const skip = (page - 1) * limit;

    // Search condition (optional)
    const searchCondition = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const baseFilter = {
      role: UserRole.EMPLOYER,
      isEmployerApproved: false,
      ...searchCondition,
    };

    // Count total for pagination
    const total = await this.userModel.countDocuments(baseFilter);

    // Fetch paginated results
    const pendingEmployers = await this.userModel
      .find(baseFilter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      statusCode: 200,
      message: 'Pending employers retrieved successfully',
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
      users: pendingEmployers.map((employer) => ({
        id: employer._id,
        name: employer.name,
        email: employer.email,
        role: employer.role,
        isEmployerApproved: employer.isEmployerApproved,
        isBlocked: employer.isBlocked,
      })),
    };
  }

  async getAllUsers(query: GetUsersQueryDto) {
    const { page = 1, limit = 10, search, role, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (role) filter.role = role;
    if (typeof status === 'boolean') filter.isBlocked = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.userModel.countDocuments(filter),
    ]);

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      })),
    };
  }

  async approveEmployer(employerId: string) {
    const employer = await this.userModel.findById(employerId);

    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    if (employer.role !== UserRole.EMPLOYER) {
      throw new NotFoundException('User is not an employer');
    }

    employer.isEmployerApproved = true;
    await employer.save();

    return {
      statusCode: 200,
      message: 'Employer approved successfully',
      user: {
        id: employer._id,
        name: employer.name,
        email: employer.email,
        role: employer.role,
        isBlocked: employer.isBlocked,
        isEmployerApproved: employer.isEmployerApproved,
      },
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

    const jobs = await this.jobModel
      .find(filter)
      .populate('employer', 'name email')
      .sort({ _id: -1 })
      .limit(limit);

    const nextCursor = jobs.length ? jobs[jobs.length - 1]._id : null;

    return {
      statusCode: 200,
      message: 'Jobs retrieved successfully',
      nextCursor,
      hasMore: !!nextCursor,
      jobs,
    };
  }

  async getAllApplications() {
    const applications = await this.applicationModel
      .find()
      .populate('job', 'title company location')
      .populate('jobseeker', 'name email')
      .sort({ appliedAt: -1 });

    return {
      statusCode: 200,
      message: 'Applications retrieved successfully',
      applications,
    };
  }

  async toggleBlockUser(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return {
      statusCode: 200,
      message: user.isBlocked
        ? 'User blocked successfully'
        : 'User unblocked successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        isEmployerApproved: user.isEmployerApproved,
      },
    };
  }
}
